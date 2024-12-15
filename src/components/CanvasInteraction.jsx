import { useEffect, useState } from "react"; // Added missing imports
import PropTypes from "prop-types";
import Canvas from "./Canvas";
import { useNavigate } from "react-router-dom";

// Define PropTypes for the Canvas component
Canvas.propTypes = {
  canvasRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element), // Validates a ref to a DOM element
  }).isRequired, // Mark this prop as required
  brushSize: PropTypes.number.isRequired, // Mark this prop as required and a number
};

function Classifier({
  classify = true,
  filename,
  setFilename, 
  title, 
  accuracy,
  description, 
  result = null,
  isLoading, 
  canvasRef, 
  submitFunction, 
  dev = false, 
}) {
  const [currentAccuracy, setCurrentAccuracy] = useState(0); 
  const [brushSize, setBrushSize] = useState(8); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (accuracy > 0) {
      const incrementSpeed = 6.66; 
      const interval = setInterval(() => {
        setCurrentAccuracy((prevAccuracy) =>
          prevAccuracy + incrementSpeed >= accuracy
            ? accuracy
            : prevAccuracy + incrementSpeed
        );
      }, 50);

      return () => clearInterval(interval); 
    }
  }, [accuracy]);

  return (
    <div className={`flex gap-4 relative ${dev ? "bg-stripes" : ""}`}>
      {dev && (
        <div className="absolute bg-gray-200 z-10 top-14 shadow-lg w-full text-center py-4">
          <p className="text-3xl font-bold text-gray-700">Under Development</p>
          <button
            onClick={() => navigate("/create-dataset")}
            className="text-blue-700 hover:text-blue-600 underline"
          >
            Create Dataset
          </button>
        </div>
      )}

      <div className="self-center">
        <Canvas canvasRef={canvasRef} brushSize={brushSize} />
      </div>

      <div className="w-full">
        <h3 className="text-2xl font-bold tracking-wide">
          {title}{" "}
          {accuracy && (
            <span className="text-xs text-green-600">
              {currentAccuracy.toFixed(2)}%
            </span>
          )}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>

        <p className="text-xs mt-1 text-gray-600">Brush Size</p>
        <input
          type="range"
          min="2"
          max="16"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full"
        />

        {result !== null ? (
          <>
            <p className="text-xs mt-1 text-gray-600">Result:</p>
            <p className="border border-dashed bg-gray-50 mt-0.5 rounded-md py-1 text-center text-xl font-bold">
              {result}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs mt-1 text-gray-600">Filename:</p>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="mt-2 border border-dashed rounded-md px-2 w-full py-0.5 bg-gray-50"
              placeholder="Filename"
            />
          </>
        )}

        <button
          disabled={dev}
          onClick={() => submitFunction(title.toLowerCase())}
          className={`w-full bg-blue-700 hover:bg-blue-500 ${
            dev ? "cursor-not-allowed" : ""
          } transition-all rounded-md mt-4 py-2 text-white`}
        >
          {!classify ? "Download" : "Classify"}
        </button>

        <div className={`grid-cols-3 grid mt-1`}>
          <div
            className={`h-1 bg-blue-600 rounded-l-full ${
              isLoading ? "animate-loading" : ""
            }`}
          ></div>
          <div
            className={`h-1 bg-yellow-400 ${
              isLoading ? "animate-loading" : ""
            }`}
          ></div>
          <div
            className={`h-1 bg-red-600 rounded-r-full ${
              isLoading ? "animate-loading" : ""
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}

Classifier.propTypes = {
  classify: PropTypes.bool,
  filename: PropTypes.string.isRequired, 
  setFilename: PropTypes.func.isRequired, 
  title: PropTypes.string.isRequired, 
  accuracy: PropTypes.number, 
  description: PropTypes.string.isRequired, 
  result: PropTypes.string, 
  isLoading: PropTypes.bool.isRequired, 
  canvasRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element), 
  }).isRequired,
  submitFunction: PropTypes.func.isRequired, 
  dev: PropTypes.bool, 
};

export default Classifier;
