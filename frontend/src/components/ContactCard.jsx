import { Mail, Phone, Briefcase } from "lucide-react";

function ContactCard({ contact }) {
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "?";
  };

  const getAvatarColor = (name) => {
    const gradients = [
      "from-indigo-500 to-violet-500",
      "from-emerald-500 to-teal-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-cyan-500 to-blue-500",
      "from-purple-500 to-fuchsia-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-emerald-500",
    ];
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const initials = getInitials(contact.firstName, contact.lastName);
  const avatarColor = getAvatarColor(contact.firstName + contact.lastName);

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-indigo-200/50 overflow-hidden hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Avatar with gradient */}
          <div
            className={`bg-gradient-to-br ${avatarColor} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:shadow-xl`}
          >
            {initials}
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          </div>

          {/* Contact Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:bg-clip-text transition-all duration-300">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.title && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5 group-hover:text-indigo-500 transition-colors duration-300">
                <Briefcase className="h-4 w-4" />
                {contact.title}
              </p>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="mt-5 space-y-2.5 pt-4 border-t border-gray-100/50">
          {contact.emailAddresses?.length > 0 && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 group/item">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 group-hover/item:text-indigo-400 transition-colors duration-300" />
              <span className="truncate">{contact.emailAddresses[0].email}</span>
              <span className="text-xs text-gray-400 ml-auto bg-gray-100/50 px-2 py-0.5 rounded-full">
                {contact.emailAddresses[0].label}
              </span>
            </div>
          )}
          {contact.phoneNumbers?.length > 0 && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 group/item">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 group-hover/item:text-indigo-400 transition-colors duration-300" />
              <span className="truncate">{contact.phoneNumbers[0].phoneNumber}</span>
              <span className="text-xs text-gray-400 ml-auto bg-gray-100/50 px-2 py-0.5 rounded-full">
                {contact.phoneNumbers[0].label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Subtle hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
}

export default ContactCard;
