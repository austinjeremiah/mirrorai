declare module 'dkg.js' {
  export default class DKG {
    constructor(config: any);
    graph: {
      query(sparqlQuery: string, queryType: string): Promise<any>;
    };
  }
}
