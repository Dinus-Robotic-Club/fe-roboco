import { updateScore } from "@/lib/api/match";
import { IApiResponse } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateScoreMatch = () => {
  return useMutation<IApiResponse<unknown>, Error, { matchId: string; body: IScoreUpdateBody }>({
    mutationFn: ({ matchId, body }) => updateScore(matchId, body),
    onSuccess() {
      toast.success(`Score berhasil diupdate`)
    },
    onError: (error) => {
      toast.error(`Gagal mengupdate score: ${error.message}`)
    },
  })
}
