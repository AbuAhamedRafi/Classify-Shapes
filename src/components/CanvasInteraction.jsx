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

// Classifier Component
function Classifier({
  classify = true, // Default value for classify
  filename, // Filename for user input
  setFilename, // Function to update filename
  title, // Title for the classifier
  accuracy, // Accuracy value
  description, // Description of the classifier
  result = null, // Result (if available)
  isLoading, // Boolean to indicate loading state
  canvasRef, // Ref for the canvas
  submitFunction, // Function to submit the classification
  dev = false, // Development mode toggle
}) {
  const [currentAccuracy, setCurrentAccuracy] = useState(0); // Track current displayed accuracy
  const [brushSize, setBrushSize] = useState(8); // Brush size state
  const navigate = useNavigate(); // Router navigation hook

  // Increment accuracy over time
  useEffect(() => {
    if (accuracy > 0) {
      const incrementSpeed = 6.66; // Adjust the increment speed as needed
      const interval = setInterval(() => {
        setCurrentAccuracy((prevAccuracy) =>
          prevAccuracy + incrementSpeed >= accuracy
            ? accuracy
            : prevAccuracy + incrementSpeed
        );
      }, 50);

      return () => clearInterval(interval); // Cleanup on unmount or accuracy change
    }
  }, [accuracy]);

  return (
    <div className={`flex gap-4 relative ${dev ? "bg-stripes" : ""}`}>
      {/* Development mode banner */}
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

      {/* Canvas for drawing */}
      <div className="self-center">
        <Canvas canvasRef={canvasRef} brushSize={brushSize} />
      </div>

      {/* Classifier details */}
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

        {/* Brush size slider */}
        <p className="text-xs mt-1 text-gray-600">Brush Size</p>
        <input
          type="range"
          min="2"
          max="16"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))} // Ensure value is a number
          className="w-full"
        />

        {/* Result or filename input */}
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

        {/* Submit button */}
        <button
          disabled={dev}
          onClick={() => submitFunction(title.toLowerCase())}
          className={`w-full bg-blue-700 hover:bg-blue-500 ${
            dev ? "cursor-not-allowed" : ""
          } transition-all rounded-md mt-4 py-2 text-white`}
        >
          {!classify ? "Download" : "Classify"}
        </button>

        {/* Loading animation */}
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

// Define PropTypes for the Classifier component
Classifier.propTypes = {
  classify: PropTypes.bool, // Boolean to toggle classify mode
  filename: PropTypes.string.isRequired, // String for the filename
  setFilename: PropTypes.func.isRequired, // Function to set the filename
  title: PropTypes.string.isRequired, // String for the title
  accuracy: PropTypes.number, // Number for accuracy
  description: PropTypes.string.isRequired, // String for the description
  result: PropTypes.string, // String for the result (optional)
  isLoading: PropTypes.bool.isRequired, // Boolean for loading state
  canvasRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element), // Ref to a DOM element
  }).isRequired,
  submitFunction: PropTypes.func.isRequired, // Function for submitting the classifier
  dev: PropTypes.bool, // Boolean for development mode
};

export default Classifier;
