declare module 'dkg.js' {
  interface DKGConfig {
    endpoint: string;
    port: number;
    useSSL: boolean;
    maxNumberOfRetries: number;
  }

  interface QueryResult {
    data?: any[];
    [key: string]: any;
  }

  class DKG {
    constructor(config: DKGConfig);
    graph: {
      query(sparqlQuery: string, queryType: string): Promise<QueryResult>;
    };
  }

  export default DKG;
}
