import isEqual from "../core/service/isEqual";
import { Indexed } from "../core/service/set";
import store, { StoreEvents } from "../store";


export default function connect<TStateProps extends Indexed = Indexed> (
    mapStateToProps: (state: Indexed) => TStateProps
) {
  return function <C extends new (...args: any[]) => any>(Component: C) {
    return class extends (Component as new (...args: any[]) => any) {
      constructor(props: {} | undefined) {
        let previousState = mapStateToProps(store.getState());
        super({ ...props, ...previousState });
        store.on(StoreEvents.Updated, () => {
          let newState = mapStateToProps(store.getState());
          if (!isEqual(previousState, newState)) {
            this.setProps({ ...newState });
          }
          previousState = newState;
        });
      }
    };
  };
}
