import { useRef, useState } from "react";
import { User, Mail, Phone, Briefcase, X } from "lucide-react";

const emptyFormData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
};

function ContactForm({
  onSave,
  isSubmitting,
  setIsSubmitting,
  initialData,
  onCancel,
  isDarkMode,
  onDirtyChange,
}) {
  const [formData, setFormData] = useState(initialData || emptyFormData);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const submissionInProgress = useRef(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Phone must contain only digits";
        } else if (value.length < 10) {
          error = "Phone must be at least 10 digits";
        } else if (value.length > 15) {
          error = "Phone must be at most 15 digits";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ["firstName", "email", "phone"];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onDirtyChange(true);
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || submissionInProgress.current) {
      return;
    }

    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      submissionInProgress.current = true;
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } finally {
        submissionInProgress.current = false;
      }
    }
  };

  const handleReset = () => {
    setFormData(emptyFormData);
    setErrors({});
    setTouched({});
    onDirtyChange(false);
  };

  const inputClasses = (fieldName) => {
    const baseClasses =
      "w-full px-4 py-3 rounded-xl border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 bg-[#F1F6F8]";
    const errorClasses = errors[fieldName]
      ? "ring-2 ring-[#EE6C4D]/60 focus:ring-[#EE6C4D]/40"
      : "hover:bg-[#E8F1F5] focus:bg-white focus:ring-[#98C1D9]/60";
    const validClasses =
      touched[fieldName] && !errors[fieldName] && formData[fieldName]
        ? "ring-1 ring-[#98C1D9]/60"
        : "";
    return `${baseClasses} ${errorClasses} ${validClasses}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 transition-colors duration-300 ${
        isDarkMode
          ? "[&_label]:text-[#E8ECEF] [&_input]:bg-[#1B2025] [&_input]:text-[#F7FAFC] [&_input::placeholder]:text-[#89939C] [&_input:focus]:bg-[#1B2025]"
          : ""
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* First Name */}
        <div className="space-y-1.5 group">
          <label htmlFor="firstName" className="block text-sm font-semibold text-[#293241]">
            First Name <span className="text-[#EE6C4D]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#3D5A80]" />
            </div>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClasses("firstName")} pl-11`}
              disabled={isSubmitting}
            />
          </div>
          {errors.firstName && touched.firstName && (
            <p className="text-sm text-[#EE6C4D] mt-1.5 flex items-center gap-1.5 animate-slide-down">
              <X className="h-4 w-4" /> {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5 group">
          <label htmlFor="lastName" className="block text-sm font-semibold text-[#293241]">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#3D5A80]" />
            </div>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClasses("lastName")} pl-11`}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5 group">
        <label htmlFor="title" className="block text-sm font-semibold text-[#293241]">
          Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-[#3D5A80]" />
          </div>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Software Engineer"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClasses("title")} pl-11`}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5 group">
        <label htmlFor="email" className="block text-sm font-semibold text-[#293241]">
          Email <span className="text-[#EE6C4D]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#3D5A80]" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClasses("email")} pl-11`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && touched.email && (
          <p className="text-sm text-[#EE6C4D] mt-1.5 flex items-center gap-1.5 animate-slide-down">
            <X className="h-4 w-4" /> {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5 group">
        <label htmlFor="phone" className="block text-sm font-semibold text-[#293241]">
          Phone <span className="text-[#EE6C4D]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-[#3D5A80]" />
          </div>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClasses("phone")} pl-11`}
            disabled={isSubmitting}
          />
        </div>
        {errors.phone && touched.phone && (
          <p className="text-sm text-[#EE6C4D] mt-1.5 flex items-center gap-1.5 animate-slide-down">
            <X className="h-4 w-4" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-white rounded-full font-semibold bg-[#16425B] hover:bg-[#245B75] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {initialData ? "Updating..." : "Saving..."}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
            
              {initialData ? "Update Contact" : "Save Contact"}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={initialData ? onCancel : handleReset}
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#E7F1F6] text-[#293241] rounded-full font-semibold hover:bg-[#D9EAF2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? "Cancel" : "Reset"}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
