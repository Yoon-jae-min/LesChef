import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../../../models/user/userModel";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../types";
import logger from "../../../utils/system/logger";

type Provider = "kakao" | "google" | "naver";

const providerFieldMap: Record<Provider, keyof typeof User.prototype> = {
  kakao: "kakaoId",
  google: "googleId",
  naver: "naverId",
};

/**
 * SNS 계정 연동 해제 컨트롤러
 * POST /customer/unlink/:provider
 */
export const unlinkSocialAccount = asyncHandler(
  async (
    req: Request<{ provider: Provider }, ApiSuccessResponse | ApiErrorResponse>,
    res: Response<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { provider } = req.params;

    if (!req.session?.user?.id) {
      res.status(401).json({
        error: true,
        message: "로그인이 필요합니다.",
      });
      return;
    }

    if (!["kakao", "google", "naver"].includes(provider)) {
      res.status(400).json({
        error: true,
        message: "지원하지 않는 제공자입니다.",
      });
      return;
    }

    const userId = req.session.user.id;
    const field = providerFieldMap[provider];

    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        res.status(404).json({
          error: true,
          message: "사용자를 찾을 수 없습니다.",
        });
        return;
      }

      // 이미 연동이 없는 경우
      if (!user[field]) {
        res.status(200).json({
          error: false,
          message: "이미 연동되어 있지 않습니다.",
        });
        return;
      }

      // 필드 초기화
      // @ts-expect-error dynamic field assign
      user[field] = "";
      await user.save();

      res.status(200).json({
        error: false,
        message: "연동이 해제되었습니다.",
      });
    } catch (error) {
      logger.error("SNS 계정 연동 해제 실패", { error, provider, userId });
      res.status(500).json({
        error: true,
        message: "연동 해제 중 오류가 발생했습니다.",
      });
    }
  },
);

