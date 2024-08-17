/**
 * A list of modes that a certain agent has access to
 */
export interface AccessModeList {
  read: boolean;
  append: boolean;
  write: boolean;
  control: boolean;
  origin?: string;
}

/**
 * A list of modes for each kind of agent
 */
export interface WacRule {
  public: AccessModeList;
  authenticated: AccessModeList;
  agent: Record<string, AccessModeList>;
}