import type { WacRule } from "../WacRule";
import type { ResourceSuccess } from "./SuccessResult";

export interface SetWacRuleSuccess extends ResourceSuccess {
  type: "setWacRuleSuccess";
  /**
   * The written rule
   */
  wacRule: WacRule;
}
