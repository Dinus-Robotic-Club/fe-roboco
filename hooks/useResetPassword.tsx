import { resetPassword } from "@/lib/api/forgot-reset";
import { IApiResponse } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResetPassword = () => {
  return useMutation<IApiResponse<unknown>, Error, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),

    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (err) => {
      console.log('Error send forgot password', err.message)
      toast.error(err.message)
    },
  })
}
