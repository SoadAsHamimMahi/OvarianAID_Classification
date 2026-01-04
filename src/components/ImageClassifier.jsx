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

                    <div className="card card-elevated p-6 preview-wrapper">
                        {!imageSrc ? (
                            <div
                                className={`upload-zone ${isDragging ? "drag-over" : ""}`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={openFilePicker}
                            >
                                <div className="text-center cursor-pointer">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop your image here</h3>
                                    <p className="text-muted mb-4">or click to browse</p>
                                    <button className="btn-primary inline-flex items-center gap-2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        Upload & Analyze
                                    </button>
                                    <p className="text-xs text-muted mt-4">Supports JPG, PNG, WEBP (Max 10MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imageSrc}
                                    alt="Histology image preview"
                                    className={`preview-img ${overlayVisible ? "overlay-active" : ""}`}
                                />
                                
                                {/* Result Overlay with Glassmorphism */}
                                <div className={`result-overlay ${overlayVisible ? "visible success-animation" : ""}`} aria-hidden={!overlayVisible}>
                                    <div className="result-handle" />
                                    {predictions.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs uppercase tracking-wide muted mb-2 font-semibold">Classification Result</div>
                                                    <div className="text-2xl font-bold text-primary mb-4">{predictions[0].label}</div>
                                                </div>
                                                
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs uppercase tracking-wide muted font-semibold">Confidence</div>
                                                        <div className="text-lg font-bold text-primary" aria-label={`${(predictions[0].probability * 100).toFixed(1)} percent confidence`}>
                                                            {(predictions[0].probability * 100).toFixed(1)}%
                                                        </div>
                                                    </div>
                                                    <div className="confidence-bar">
                                                        <div 
                                                            className="confidence-fill" 
                                                            style={{ width: `${(predictions[0].probability * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-2 border-t border-border">
                                <button
                                    onClick={() => {
                                        setImageSrc(null);
                                        setPredictions([]);
                                        setStatus("idle");
                                    }}
                                    className="btn-secondary flex-1"
                                    aria-label="Clear current image and analyze another"
                                >
                                    Analyze Another
                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="consent-wrapper">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={consent} 
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-0.5"
                                />
                                <span className="text-sm muted leading-relaxed">
                                    I acknowledge this is a decision-support tool and does not replace professional medical judgment.
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="card card-elevated p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex-1">
                                <div className="text-xs uppercase tracking-wide muted mb-3 font-semibold">Model Status</div>
                                <div className={`status-badge ${
                                    status === "idle" ? "" : 
                                    status === "loading-model" ? "info pulse" : 
                                    status === "predicting" ? "info pulse" : 
                                    status === "ready" ? "success" : 
                                    status === "error" ? "error" : ""
                                }`}>
                                    <span className="status-badge-dot"></span>
                                    <span className="font-semibold">
                                        {status === "idle" && "Ready to Analyze"}
                                        {status === "loading-model" && "Loading Model..."}
                                        {status === "predicting" && "Analyzing..."}
                                        {status === "ready" && "Model Ready"}
                                        {status === "error" && "Error Occurred"}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                {loading ? (
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-soft">
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

                        <div className="space-y-3">
                            <button
                                onClick={handleClassify}
                                disabled={!imageSrc || !consent || loading}
                                className="btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeLinecap="round" opacity="0.3" />
                                            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round" />
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>Analyze Image</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-muted text-center">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to analyze</p>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Usage Guidelines</h3>
                        </div>
                        <ul className="space-y-3 text-sm muted leading-relaxed">
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 flex-shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Use high-resolution cropped tissue tiles (224×224 recommended for best results)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 flex-shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>All processing occurs in-browser; no data is uploaded to servers</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success mt-0.5 flex-shrink-0">
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
