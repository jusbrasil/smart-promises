// @flow

import batchingFilter from './batching';
import circuitBreakerFilter from './circuit-breaker';
import cachingFilter from './caching';
import dedupFilter from './dedup';
import forkJoinFilter from './fork-join';
import hedgeRequestFilter from './hedge-request';

export type Service<Req, Rep> = (input: Req) => Promise<Rep>;

export type Filter<ReqOut, ReqIn, RepIn, RepOut> =
  (service: Service<ReqIn, RepIn>) => Service<ReqOut, RepOut>;

class FilterStack<ReqOut, ReqIn, RepIn, RepOut> {
  static prepare(): FilterStack<any, any, any, any> {
    return new FilterStack(service => service);
  }

  builder: Filter<ReqOut, ReqIn, RepIn, RepOut>;

  constructor(builder: Filter<ReqOut, ReqIn, RepIn, RepOut>) {
    this.builder = builder;
  }

  andThen<Req, Rep>(
    filter: Filter<ReqIn, Req, Rep, RepIn>
  ): FilterStack<ReqOut, Req, Rep, RepOut> {
    return new FilterStack(
      (service) => this.builder(filter(service))
    );
  }
}

export default {
  batchingFilter,
  circuitBreakerFilter,
  cachingFilter,
  dedupFilter,
  forkJoinFilter,
  hedgeRequestFilter,
  FilterStack,
};
