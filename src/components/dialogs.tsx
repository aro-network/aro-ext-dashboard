import { Modal, ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeader, ModalProps } from "@nextui-org/react";
import { FiX } from "react-icons/fi";

export function ForceModal({
  children,
  contentProps,
  bodyProps,
  ...props
}: ModalProps & {
  contentProps?: ModalContentProps;
  bodyProps?: ModalBodyProps;
}) {
  return (
    <Modal isDismissable={false} backdrop="blur" classNames={{ backdrop: "backdrop-blur" }} hideCloseButton {...props}>
      <ModalContent className="w-[360px] p-6 bg-m1 rounded-3xl" {...(contentProps || {})}>
        <ModalBody className="flex flex-col justify-start items-center w-full gap-6 p-0" {...(bodyProps || {})}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function TitModal({
  tit,
  children,
  contentProps,
  bodyProps,
  ...props
}: ModalProps & {
  contentProps?: ModalContentProps;
  bodyProps?: ModalBodyProps;
  tit?: string;
}) {
  return (
    <Modal hideCloseButton backdrop="blur" classNames={{ backdrop: "backdrop-blur" }} {...props}>
      <ModalContent className="w-[500px] bg-m1 gap-6 p-6 rounded-3xl" {...(contentProps || {})}>
        {(onClose) => (
          <>
            <ModalHeader className="justify-between p-0">
              <span className="text-base font-bold text-left text-white">{tit}</span>
              <div className="p-0 rounded-full w-6 h-6 flex justify-center items-center text-xs cursor-pointer bg-white/10 hover:bg-white/30" onClick={onClose}>
                <FiX />
              </div>
            </ModalHeader>
            <ModalBody className="flex flex-col justify-start items-center w-full gap-6 p-0" {...(bodyProps || {})}>
              {children}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
