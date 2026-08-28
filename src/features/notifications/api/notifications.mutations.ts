import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "./notifications.service";
import { notificationsKeys } from "./notifications.queries";

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};
