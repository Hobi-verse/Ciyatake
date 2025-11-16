// AuthForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "./Button";
import Skeleton from "./Skeleton";

const defaultInputClasses =
  "w-full rounded-xl border-2 border-[#DCECE9] bg-white px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:border-[#b8985b] focus:outline-none focus:ring-4 focus:ring-[#b8985b]/20 hover:border-[#b8985b]/40 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

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
  loading = false,
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
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        ) : null}
        <div className="relative group">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b8985b] transition-all duration-200 hover:bg-[#b8985b]/10 hover:text-[#a9894f]"
              tabIndex={-1}
            >
              {visibleFields[fieldName] ? "Hide" : "Show"}
            </button>
          ) : null}
        </div>
        {helperText ? (
          <p className="mt-2 text-xs text-slate-500">{helperText}</p>
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

  const renderStatusMessage = () => {
    if (!status?.message) {
      return null;
    }

    const toneClasses =
      status.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : status.type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

    const iconMap = {
      error: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    };

    return (
      <div className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium ${toneClasses}`} style={{ animation: 'slide-in-from-top-2 0.3s ease-out' }}>
        {iconMap[status.type] || iconMap.info}
        <span className="flex-1">{status.message}</span>
      </div>
    );
  };

  const visibleFieldCount = useMemo(
    () => Math.max(fields.filter((field) => !field?.hidden).length || 0, 2),
    [fields]
  );

  const statusMessage = renderStatusMessage();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#DCECE9] bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8">
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>

          <div className="mt-8 space-y-5">
            {Array.from({ length: visibleFieldCount }).map((_, index) => (
              <div key={`auth-skeleton-field-${index}`} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" rounded={false} />
              </div>
            ))}

            <Skeleton
              className="ml-auto h-3 w-28 rounded-full"
              rounded={false}
            />
            <Skeleton className="h-12 w-full rounded-full" rounded={false} />
          </div>

          {socialProviders.length ? (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                <Skeleton className="h-px flex-1" rounded={false} />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-px flex-1" rounded={false} />
              </div>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: socialProviders.length }).map(
                  (_, index) => (
                    <Skeleton
                      key={`auth-skeleton-provider-${index}`}
                      className="h-12 flex-1 rounded-full"
                      rounded={false}
                    />
                  )
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-6 space-y-2 text-center">
            <Skeleton className="mx-auto h-3 w-56" />
            <Skeleton className="mx-auto h-3 w-32" />
          </div>

          {statusMessage ? <div className="mt-6">{statusMessage}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-y-auto rounded-3xl border-2 border-[#DCECE9] bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8 animate-slide-in-from-bottom-4">
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {fields.map((field, index) => renderField(field, index))}

          {forgetPasswordText ? (
            <div className="text-right text-sm">
              <button
                type="button"
                className="font-semibold text-[#b8985b] transition-all duration-200 hover:text-[#a9894f] hover:underline underline-offset-2"
                onClick={() => navigate("/forget-password")}
              >
                {forgetPasswordText}
              </button>
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitDisabled} className="w-full h-12 text-base font-semibold shadow-lg shadow-[#b8985b]/30 hover:shadow-xl hover:shadow-[#b8985b]/40 transition-all duration-200">
            {buttonLabel}
          </Button>
          {statusMessage}
        </form>

        {socialProviders.length ? (
          <>
            <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DCECE9] to-transparent" />
              <span>Or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DCECE9] to-transparent" />
            </div>
            <div className="flex flex-wrap gap-3">
              {socialProviders.map((provider, index) => (
                <Button
                  key={`${provider.label}-${index}`}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-[#DCECE9] text-slate-700 font-semibold hover:border-[#b8985b] hover:bg-[#b8985b]/5 hover:text-[#b8985b] transition-all duration-200"
                  onClick={provider.onClick}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with {provider.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          {footerText}{" "}
          <Link
            to={footerLinkHref}
            className="font-semibold text-[#b8985b] transition-all duration-200 hover:text-[#a9894f] hover:underline underline-offset-2"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
