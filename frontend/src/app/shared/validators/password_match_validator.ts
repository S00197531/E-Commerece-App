import { AbstractControl } from "@angular/forms"

export const PasswordsMatchValidator = (passwordControlName: string,
    confirmPasswordControlName: string) => {
        const validator = (form: AbstractControl) => {
            const passwordControl = form.get(passwordControlName);
            const confirmPasswordControl = form.get(confirmPasswordControlName);

            if(!passwordControl )

        }
    }