import dayjs from "@/shared/domain/dayjs";

type ReasonConfirmData = {
  caseStartId: number;
  caseEndId: number;
  reason: string;
  setAt: dayjs.Dayjs;
};

export default class MemoryStore {
  pendingReasonConfirmations = new Map<string, ReasonConfirmData>();
}
