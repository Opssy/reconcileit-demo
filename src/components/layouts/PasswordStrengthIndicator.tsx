import { Check, X } from 'lucide-react';
import React from 'react';

interface PasswordRequirement {
    label: string,
    test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
    password: string;
}


const PasswordRequirements: PasswordRequirement[] = [
    {
        label: "At least 8 characters",
        test: (password: string) => password.length >= 8,
    },
    {
        label: "At least one uppercase letter",
        test: (password: string) => /[A-Z]/.test(password),
    },
    {
        label: "At least one lowercase letter",
        test: (password: string) => /[a-z]/.test(password),
    },
    {
        label: "At least one number",
        test: (password: string) => /[0-9]/.test(password),
    },
    {
        label: "At least one special character",
        test: (password: string) => /[^a-zA-Z0-9]/.test(password),
    },
];        
        export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
          if (!password) return null;
        
          return (
            <div className="space-y-2 mt-2">
              <div className="text-xs text-slate-600 font-medium">Password requirements:</div>
              <div className="grid grid-cols-1 gap-1">
                {PasswordRequirements.map((requirement, index) => {
                  const isValid = requirement.test(password);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                        isValid
                          ? 'text-green-600'
                          : password.length > 0
                            ? 'text-slate-400'
                            : 'text-slate-300'
                      }`}
                    >
                      {isValid ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className={`h-3 w-3 ${password.length > 0 ? 'text-slate-400' : 'text-slate-300'}`} />
                      )}
                      <span className={isValid ? 'font-medium' : password.length > 0 ? 'font-normal' : 'font-light'}>
                        {requirement.label}
                      </span>
                    </div>
                  );
                })}
      </div>
    </div>
    );   
}