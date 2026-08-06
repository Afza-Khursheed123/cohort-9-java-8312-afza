import { useState } from "react";
import { User, Mail, Phone, Briefcase, X, Sparkles } from "lucide-react";

function ContactForm({ onSave, isSubmitting, setIsSubmitting }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      setIsSubmitting(true);
      onSave(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
    });
    setErrors({});
    setTouched({});
  };

  const inputClasses = (fieldName) => {
    const baseClasses =
      "w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm";
    const errorClasses = errors[fieldName]
      ? "border-rose-400 focus:ring-rose-400/30 bg-rose-50/30"
      : "border-gray-200 hover:border-indigo-300 focus:ring-indigo-400/30";
    const validClasses =
      touched[fieldName] && !errors[fieldName] && formData[fieldName]
        ? "border-emerald-400 focus:ring-emerald-400/30 bg-emerald-50/30"
        : "";
    return `${baseClasses} ${errorClasses} ${validClasses}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* First Name */}
        <div className="space-y-1.5 group">
          <label className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
            First Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
            </div>
            <input
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
            <p className="text-sm text-rose-500 mt-1.5 flex items-center gap-1.5 animate-slideDown">
              <X className="h-4 w-4" /> {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5 group">
          <label className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
            </div>
            <input
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
        <label className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
          Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
          </div>
          <input
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
        <label className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
          Email <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
          </div>
          <input
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
          <p className="text-sm text-rose-500 mt-1.5 flex items-center gap-1.5 animate-slideDown">
            <X className="h-4 w-4" /> {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5 group">
        <label className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
          Phone <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
          </div>
          <input
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
          <p className="text-sm text-rose-500 mt-1.5 flex items-center gap-1.5 animate-slideDown">
            <X className="h-4 w-4" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
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
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
            
              Save Contact
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="px-6 py-3.5 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default ContactForm;