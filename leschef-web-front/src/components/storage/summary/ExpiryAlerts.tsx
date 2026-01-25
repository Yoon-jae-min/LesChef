/**
 * 유통기한 알림 요약 컴포넌트
 */

import type { ExpiryAlertResponse } from "@/utils/api/foods";

interface ExpiryAlertsProps {
  alerts: ExpiryAlertResponse | undefined;
}

export default function ExpiryAlerts({ alerts }: ExpiryAlertsProps) {
  if (!alerts) return null;
  
  const hasAlerts =
    alerts.expiredCount > 0 ||
    alerts.urgentCount > 0 ||
    alerts.warningCount > 0 ||
    alerts.noticeCount > 0;

  if (!hasAlerts) return null;

  return (
    <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">유통기한 알림</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {alerts.expiredCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-gray-700">
                  <span className="font-semibold text-red-600">{alerts.expiredCount}</span>개 만료
                </span>
              </div>
            )}
            {alerts.urgentCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-700">
                  <span className="font-semibold text-orange-600">{alerts.urgentCount}</span>개 긴급
                </span>
              </div>
            )}
            {alerts.warningCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-gray-700">
                  <span className="font-semibold text-yellow-600">{alerts.warningCount}</span>개 경고
                </span>
              </div>
            )}
            {alerts.noticeCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-gray-700">
                  <span className="font-semibold text-blue-600">{alerts.noticeCount}</span>개 알림
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

