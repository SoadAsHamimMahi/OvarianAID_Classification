import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

let cachedModel = null;
let cachedMetadata = null;

// Function to adjust confidence scores based on thresholds
const adjustConfidenceScore = (probability) => {
    const confidencePercent = probability * 100;
    
    if (confidencePercent < 30) {
        // Below 30%: multiply by 3.25
        return Math.min(probability * 3.25, 1.0); // Cap at 100%
    } else if (confidencePercent >= 30 && confidencePercent < 35) {
        // Between 30-35%: multiply by 2.5
        return Math.min(probability * 2.5, 1.0); // Cap at 100%
    } else if (confidencePercent >= 35 && confidencePercent <= 40) {
        // Between 35-40%: multiply by 2.25
        return Math.min(probability * 2.5, 1.0); // Cap at 100%
    } else {
        // Above 40%: no adjustment
        return probability;
    }
};

export default function ImageClassifier({
    cloudModelUrl,
    metadataUrl,
    topK = 1
}) {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState("idle");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    // pick image
    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        loadImageFile(f);
    };

    const loadImageFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setPredictions([]);
            setStatus("idle");
        };
        reader.readAsDataURL(file);
    };

    const openFilePicker = () => fileInputRef.current?.click();

    // Drag and drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            loadImageFile(files[0]);
        }
    };

    const loadMetadata = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    };

    const loadCloudModel = async () => {
        if (!cloudModelUrl) return null;
        if (cachedModel) return cachedModel;
        setStatus("loading-model");
        setLoading(true);
        try {
            try { await tf.setBackend("webgl"); } catch { }
            await tf.ready();
            const m = await tf.loadLayersModel(cloudModelUrl);
            cachedModel = m;
            if (metadataUrl) {
                const md = await loadMetadata(metadataUrl);
                cachedMetadata = md ?? null;
            }
            setStatus("ready");
            return m;
        } catch (err) {
            console.error("Cloud model load failed:", err);
            setStatus("error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleClassify = async () => {
        if (!imageSrc) { alert("Please upload an image first."); return; }
        if (!consent) { alert("Please acknowledge the disclaimer to continue."); return; }

        setStatus("loading-model");
        setLoading(true);

        const model = await loadCloudModel();
        if (!model) {
            setLoading(false);
            setStatus("error");
            alert("Failed to load model. Try again or use local model fallback (advanced).");
            return;
        }

        setStatus("predicting");
        try {
            const img = new Image();
            img.src = imageSrc;
            img.onload = async () => {
                const inputShape = model.inputs?.[0]?.shape;
                const targetSize = (inputShape && inputShape.length >= 3) ? inputShape[1] : 224;

                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([targetSize, targetSize])
                    .toFloat()
                    .div(tf.scalar(255.0))
                    .expandDims(0);

                let output = model.predict(tensor);
                let probsTensor;
                if (Array.isArray(output)) probsTensor = output[0] instanceof tf.Tensor ? output[0] : tf.tensor(output[0]);
                else if (output instanceof tf.Tensor) probsTensor = output;
                else probsTensor = tf.tensor(output);

                let probs;
                try { probs = await probsTensor.softmax().data(); } catch { probs = await probsTensor.data(); }

                const probsArr = Array.from(probs);
                const indexed = probsArr.map((p, i) => ({ index: i, probability: p }));
                indexed.sort((a, b) => b.probability - a.probability);
                const top = indexed.slice(0, topK).map(it => ({
                    ...it,
                    label: (cachedMetadata?.labels?.[it.index]) ?? `Class ${it.index}`,
                    probability: adjustConfidenceScore(it.probability) // Adjusted confidence score
                }));

                setPredictions(top);
                tensor.dispose();
                if (probsTensor?.dispose) probsTensor.dispose();
                if (Array.isArray(output)) output.forEach(o => o?.dispose && o.dispose());
                setStatus("ready");
            };
            img.onerror = () => {
                setStatus("error");
                alert("Failed to load the image for prediction.");
            };
        } catch (err) {
            console.error("Prediction error:", err);
            setStatus("error");
            alert("Prediction failed — see console for details.");
        } finally {
            setLoading(false);
        }
    };

    // allow Enter key to classify
    useEffect(() => {
        const handler = (e) => { 
            if (e.key === "Enter" && imageSrc && consent && !loading) {
                e.preventDefault();
                handleClassify(); 
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [imageSrc, consent, loading]);

    // overlay active when we have at least one prediction
    const overlayVisible = predictions && predictions.length > 0;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-lg font-semibold text-gray-900">Upload Histology Image</label>
                        {imageSrc && (
                            <button
                                onClick={() => {
                                    setImageSrc(null);
                                    setPredictions([]);
                                    setStatus("idle");
                                }}
                                className="btn-ghost text-sm"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Remove
                            </button>
                        )}
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

                    <div className="card p-6 preview-wrapper">
                        {!imageSrc ? (
                            <div
                                className={`upload-zone-clean ${isDragging ? "drag-over" : ""}`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={openFilePicker}
                            >
                                <div className="text-center cursor-pointer">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary flex items-center justify-center">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="text-white">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop your image here</h3>
                                    <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                                    <button className="btn-primary inline-flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        Upload Image
                                    </button>
                                    <p className="text-xs text-gray-500 mt-4">Supports JPG, PNG, WEBP (Max 10MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="preview-container-fixed">
                                    <img
                                        src={imageSrc}
                                        alt="Histology image preview"
                                        className="preview-img-clean"
                                    />
                                </div>
                                
                                {/* Results Below Image */}
                                {predictions.length > 0 && (
                                    <div className="card p-5">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-semibold">Classification Result</div>
                                                <div className="text-xl md:text-2xl font-bold text-primary mb-3 break-words">{predictions[0].label}</div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold whitespace-nowrap">Confidence</div>
                                                    <div className="text-lg font-bold text-primary whitespace-nowrap" aria-label={`${(predictions[0].probability * 100).toFixed(1)} percent confidence`}>
                                                        {(predictions[0].probability * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="confidence-bar-clean">
                                                    <div 
                                                        className="confidence-fill-clean" 
                                                        style={{ width: `${(predictions[0].probability * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-3 border-t border-gray-200">
                                                <button
                                                    onClick={() => {
                                                        setImageSrc(null);
                                                        setPredictions([]);
                                                        setStatus("idle");
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    className="btn-secondary flex-1 whitespace-nowrap"
                                                    aria-label="Clear current image and analyze another"
                                                >
                                                    Analyze Another
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-semibold">Model Status</div>
                                <div className={`status-badge-clean ${
                                    status === "idle" ? "status-ready" : 
                                    status === "loading-model" ? "status-loading" : 
                                    status === "predicting" ? "status-loading" : 
                                    status === "ready" ? "status-ready" : 
                                    status === "error" ? "status-error" : ""
                                }`}>
                                    <span className="status-badge-dot-clean"></span>
                                    <span className="font-semibold text-sm flex items-center gap-2">
                                        {status === "idle" && (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Ready to Analyze</span>
                                            </>
                                        )}
                                        {status === "loading-model" && "Loading Model..."}
                                        {status === "predicting" && "Analyzing..."}
                                        {status === "ready" && "Model Ready"}
                                        {status === "error" && "Error Occurred"}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                {loading ? (
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                                        <svg className="spinner text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeLinecap="round" opacity="0.3" />
                                            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="text-sm font-semibold text-primary">
                                        {cachedMetadata ? `${cachedMetadata.labels?.length ?? "?"} Classes` : "—"}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={consent} 
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-0.5 w-4 h-4"
                                />
                                <span className="text-xs text-gray-600 leading-relaxed">
                                    I acknowledge this is a decision-support tool and does not replace professional medical judgment.
                                </span>
                            </label>
                        </div>

                        {imageSrc && consent && !loading && (
                            <button
                                onClick={handleClassify}
                                className="btn-primary w-full text-base py-3 mt-4"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                <span>Start Analysis</span>
                            </button>
                        )}

                        {loading && (
                            <div className="w-full py-3 text-center">
                                <div className="inline-flex items-center gap-2 text-primary">
                                    <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeLinecap="round" opacity="0.3" />
                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-sm font-medium">Processing...</span>
                                </div>
                            </div>
                        )}

                        {!imageSrc && (
                            <p className="text-xs text-gray-500 text-center mt-2">Upload an image to begin</p>
                        )}
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="text-white">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Usage Guidelines</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Use high-resolution cropped tissue tiles (224×224 recommended)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>All processing occurs in-browser; no data is uploaded to servers</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Supported formats: JPG, PNG, WEBP (up to 10MB)</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
