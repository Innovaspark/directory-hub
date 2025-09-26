import { Observable, of, timer, merge } from 'rxjs';
import { switchMap, distinctUntilChanged, mapTo, shareReplay } from 'rxjs/operators';

export function enforceMinimumOnDuration(
  source$: Observable<boolean>,
  minOnDurationMs: number
): Observable<boolean> {
  let lockActive = false;
  let lockTimer$: Observable<boolean> = timer(0).pipe(mapTo(false));

  return source$.pipe(
    distinctUntilChanged(),
    switchMap((value: boolean) => {
      if (value) {
        lockActive = true;
        lockTimer$ = timer(minOnDurationMs).pipe(
          mapTo(false),
          shareReplay(1)
        );
        return merge(of(true), lockTimer$);
      } else {
        if (lockActive) {
          return lockTimer$.pipe(
            switchMap(() => {
              lockActive = false;
              return of(false);
            })
          );
        } else {
          return of(false);
        }
      }
    }),
    shareReplay(1)
  );
}
