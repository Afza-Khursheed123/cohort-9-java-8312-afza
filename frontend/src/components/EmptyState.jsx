import { Users, Sparkles } from "lucide-react";

function EmptyState({ onAddContact }) {
  return (
    <div className="text-center py-20 bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-indigo-200/50 relative overflow-hidden group">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5 animate-gradient"></div>
      
      <div className="relative">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 mb-6 shadow-xl shadow-indigo-500/20 animate-bounce">
          <Users className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          No contacts yet
        </h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-lg">
          Get started by adding your first contact. 
          <span className="block text-indigo-500 font-medium mt-1">
            Your network is your net worth 💫
          </span>
        </p>
        <button
          onClick={onAddContact}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="h-5 w-5" />
          Add Your First Contact
        </button>
      </div>
    </div>
  );
}

export default EmptyState;