import { Plus, Users } from "lucide-react";

function EmptyState({ onAddContact, isDarkMode }) {
  return (
    <div className={`text-center py-16 rounded-3xl transition-colors duration-300 ${isDarkMode ? "bg-[#242B31]" : "bg-[#E4E9EC]"}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#3D5A80] mb-6 shadow-lg shadow-[#16425B]/15">
        <Users className="h-10 w-10 text-[#E0FBFC]" />
      </div>
      <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-[#E0FBFC]" : "text-[#293241]"}`}>
        No contacts yet
      </h3>
      <p className={`mt-2 max-w-md mx-auto ${isDarkMode ? "text-[#98C1D9]" : "text-[#3D5A80]"}`}>
        Get started by adding your first contact.
      </p>
      <button
        onClick={onAddContact}
        className="mt-8 px-6 py-3 bg-[#EE6C4D] text-white rounded-full font-semibold hover:bg-[#F07A5E] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        <Plus className="h-5 w-5" />
        Add Your First Contact
      </button>
    </div>
  );
}

export default EmptyState;
