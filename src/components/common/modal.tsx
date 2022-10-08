import { PropsWithChildren, ReactNode } from 'react';

type ModalProps = PropsWithChildren<{
  title: ReactNode;
  id: string;
}>;

function Modal({ children, title, id }: ModalProps): JSX.Element {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
      />
      <label className="modal" htmlFor={id}>
        <div className="modal-box bg-slate-600 text-white w-[80vw]">
          <h2 className="text-4xl font-bold pb-2 text-center">
            {title}
          </h2>
          {children}
        </div>
      </label>
    </>
  );
}

export default Modal;
