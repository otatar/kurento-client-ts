export type KurentoEventType = "IceCandidateFound";

export type KurentoEvent = {
  type: KurentoEventType;
  data?: any;
  object?: string;
};
