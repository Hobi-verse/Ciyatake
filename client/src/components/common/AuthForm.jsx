// AuthForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const defaultInputClasses =
  "w-full rounded-lg border border-[#DCECE9] bg-white px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const AuthForm = ({
  title = "Welcome back",
  subtitle = "Sign in to continue your shopping journey.",
  fields = [],
  initialValues = {},
  onSubmit,
  onFieldChange,
  socialProviders = [],
  buttonLabel = "Sign In",
  isSubmitDisabled = false,
  footerText = "Don't have an account?",
  footerLinkText = "Sign up",
  footerLinkHref = "#",
  forgetPasswordText = "",
  status = null,
}) => {
  const navigate = useNavigate();

  const initialState = useMemo(() => {
    const base = { ...initialValues };
    fields.forEach((field = {}) => {
      if (typeof field.name !== "string" || !field.name.length) {
        return;
      }
      if (base[field.name] === undefined) {
        base[field.name] = field.defaultValue ?? "";
      }
    });
    return base;
  }, [fields, initialValues]);

  const [formData, setFormData] = useState(initialState);
  const [visibleFields, setVisibleFields] = useState({});

  const fieldsSignature = useMemo(
    () =>
      JSON.stringify(
        fields.map((field = {}) => ({
          name: field.name ?? null,
          hidden: !!field.hidden,
        }))
      ),
    [fields]
  );

  const initialValuesSignature = useMemo(
    () => JSON.stringify(initialValues ?? {}),
    [initialValues]
  );

  const signatureRef = useRef(`${fieldsSignature}|${initialValuesSignature}`);

  useEffect(() => {
    const nextSignature = `${fieldsSignature}|${initialValuesSignature}`;
    if (signatureRef.current !== nextSignature) {
      signatureRef.current = nextSignature;
      setFormData(initialState);
      setVisibleFields({});
    }
  }, [fieldsSignature, initialValuesSignature, initialState]);

  const setFieldValue = (name, value) => {
    if (typeof name !== "string" || !name.length) {
      return;
    }

    setFormData((previous) => {
      const next = { ...previous, [name]: value };
      onFieldChange?.(name, value, next);
      return next;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }
    onSubmit?.(formData, { reset: () => setFormData(initialState) });
  };

  const toggleVisibility = (name) => {
    if (!name) {
      return;
    }
    setVisibleFields((previous) => ({
      ...previous,
      [name]: !previous?.[name],
    }));
  };

  const renderStandardField = (field, index) => {
    if (field.hidden) {
      return null;
    }

    const {
      name,
      label,
      type = "text",
      placeholder,
      required,
      disabled,
      autoComplete,
      inputMode,
      maxLength,
      helperText,
      wrapperClassName = "",
      inputClassName = "",
      id,
    } = field;

    const fieldName = name ?? `field-${index}`;
    const inputId = id ?? `${fieldName}-input`;
    const value = formData[fieldName] ?? "";
    const isPassword = type === "password";
    const displayType = isPassword && visibleFields[fieldName] ? "text" : type;

    return (
      <div key={fieldName} className={wrapperClassName}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            id={inputId}
            name={fieldName}
            type={displayType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
            className={`${defaultInputClasses} ${inputClassName}`.trim()}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => toggleVisibility(fieldName)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-[#b8985b] transition hover:text-[#a9894f]"
            >
              {visibleFields[fieldName] ? "Hide" : "Show"}
            </button>
          ) : null}
        </div>
        {helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  };

  const renderField = (field, index) => {
    if (!field || field.hidden) {
      return null;
    }

    if (typeof field.render === "function") {
      const fieldName = field.name ?? `custom-field-${index}`;
      const value = field.name ? formData[field.name] : undefined;

      return (
        <div key={fieldName} className={field.wrapperClassName ?? ""}>
          {field.render({
            field,
            value,
            setValue: (nextValue) => setFieldValue(field.name, nextValue),
            formData,
            setFieldValue,
            toggleVisibility: () => toggleVisibility(field.name),
            isVisible: !!visibleFields[field.name],
            inputClasses: defaultInputClasses,
          })}
        </div>
      );
    }

    return renderStandardField(field, index);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#f5f2ee]">
      <div className="w-full max-w-md overflow-y-auto rounded-2xl border border-[#DCECE9] bg-white/95 p-8 shadow-[0_36px_80px_rgba(15,23,42,0.14)]">
        <h2 className="text-center text-2xl font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((field, index) => renderField(field, index))}

          {forgetPasswordText ? (
            <div className="text-right text-sm">
              <button
                type="button"
                className="font-semibold text-[#b8985b] transition hover:text-[#a9894f]"
                onClick={() => navigate("/forget-password")}
              >
                {forgetPasswordText}
              </button>
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitDisabled} className="w-full">
            {buttonLabel}
          </Button>

          {status?.message ? (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                status.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : status.type === "success"
                  ? "border-[#c3dedd] bg-[#c3dedd]/20 text-[#2f4a55]"
                  : "border-[#DCECE9] bg-[#F2EAE0] text-slate-600"
              }`}
            >
              {status.message}
            </div>
          ) : null}
        </form>

        {socialProviders.length ? (
          <>
            <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              <div className="h-px flex-1 bg-[#DCECE9]" />
              <span>Or continue with</span>
              <div className="h-px flex-1 bg-[#DCECE9]" />
            </div>
            <div className="flex flex-wrap gap-3">
              {socialProviders.map((provider, index) => (
                <Button
                  key={`${provider.label}-${index}`}
                  variant="outline"
                  className="flex-1 border-[#DCECE9] text-slate-600 hover:border-[#b8985b] hover:text-[#b8985b]"
                  onClick={provider.onClick}
                >
                  Continue with {provider.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          {footerText}{" "}
          <a
            href={footerLinkHref}
            className="font-semibold text-[#b8985b] transition hover:text-[#a9894f]"
          >
            {footerLinkText}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
