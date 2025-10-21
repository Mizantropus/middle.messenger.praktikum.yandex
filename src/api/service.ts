import isEqual from "../core/service/isEqual";
import { Indexed } from "../core/service/set";
import store, { StoreEvents } from "../store";


// export default function connect<TStateProps extends Indexed = Indexed> (
//     mapStateToProps: (state: Indexed) => TStateProps
// ) {
//   return function <C extends new (...args: any[]) => any>(Component: C) {
//     return class extends (Component as new (...args: any[]) => any) {
//       constructor(props: {} | undefined) {
//         let previousState = mapStateToProps(store.getState());
//         super({ ...props, ...previousState });
//         store.on(StoreEvents.Updated, () => {
//           let newState = mapStateToProps(store.getState());
//           if (!isEqual(previousState, newState)) {
//             this.setProps({ ...newState });
//           }
//           previousState = newState;
//         });
//       }
//     };
//   };
// }

export default function connect<
  S extends Indexed = Indexed,
  TStateProps extends Indexed = Indexed,
  P extends Indexed = Indexed
>(
  mapStateToProps: (state: S) => TStateProps
) {
  type ComponentProps = P & TStateProps;
  type ComponentInstance = { setProps(next: Partial<ComponentProps> | TStateProps): void };
  return function <C extends new (props: ComponentProps) => ComponentInstance>(
    Component: C
  ) {
    return class extends (Component as new (props: ComponentProps) => ComponentInstance) {
      constructor(props?: P) {
        let previousState = mapStateToProps(store.getState() as S);
        super({ ...(props as P), ...previousState } as ComponentProps);
        store.on(StoreEvents.Updated, () => {
          const newState = mapStateToProps(store.getState() as S);
          if (!isEqual(previousState, newState)) {
            (this as unknown as ComponentInstance).setProps(newState);
          }
          previousState = newState;
        });
      }
    } as unknown as C;
  };
}
