import React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

/**
 * Interface for the analysis response data
 */
interface Response {
  expr: string
  result: string
  assign: boolean
}

/**
 * Props interface for ResultsModal component
 */
interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  responses: Response[]
  onDrawNew: () => void
}

/**
 * ResultsModal Component
 * 
 * Displays analysis results in a modal dialog with options to close or start a new drawing
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to call when closing the modal
 * @param responses - Array of analysis results to display
 * @param onDrawNew - Function to call when starting a new drawing
 */
const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, responses, onDrawNew }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-lg shadow-2xl w-[90%] max-w-md border border-blue-500/30 max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {responses.map((response, index) => (
            <div key={index} className="border-b border-gray-600 pb-6 last:border-0">
              {/* Quick Description Section */}
              <div className="mb-3">
                <p className="text-sm font-medium text-blue-400">Quick Description</p>
                <p className="text-lg font-semibold text-white mt-1">{response.expr}</p>
              </div>

              {/* Detailed Analysis Section */}
              <div>
                <p className="text-sm font-medium text-blue-400">Detailed Analysis</p>
                <p className="text-gray-300 whitespace-pre-wrap mt-1">{response.result}</p>
              </div>

              {/* Variable Assignment Badge */}
              {response.assign && (
                <span className="inline-block mt-3 text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded border border-blue-500/30">
                  Variable Value Set
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            onClick={onDrawNew}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
          >
            Draw Something New
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResultsModal
