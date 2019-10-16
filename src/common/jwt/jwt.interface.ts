export default interface IJwt {
  data: {
    userId: number;
    sessionId: number;
    email: string;
  };

}
