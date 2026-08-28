import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, UpdateNotificationSettingsPayload } from "./settings.service";
import { settingsKeys } from "./settings.queries";

export const useUpdateNotificationSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotificationSettingsPayload) =>
      settingsService.updateNotificationSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.notificationSettings(), data);
      queryClient.invalidateQueries({
        queryKey: settingsKeys.notificationSettings(),
      });
    },
  });
};
