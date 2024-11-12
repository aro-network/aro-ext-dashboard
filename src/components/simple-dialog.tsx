import { Button, ButtonProps, Modal, ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeader, ModalProps } from "@nextui-org/react";
import React from "react";
import { FiX } from "react-icons/fi";

export function SimpleDialog({
  trigger,
  title,
  children,
  className,
  style,
  triggerProps,
  bodyProps,
  ...props
}: {
  trigger?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  triggerProps?: ButtonProps;
  contentProps?: ModalContentProps;
  bodyProps?: ModalBodyProps;
} & ModalProps) {
  return (
    <>
      {typeof trigger == "string" ? (
        <Button color="primary" {...triggerProps}>
          {trigger}
        </Button>
      ) : (
        trigger
      )}
      <Modal {...props}>
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                <div className="lex-grow-0 flex-shrink-0 text-base font-bold text-left text-white">{title}</div>
                <div
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden gap-2.5 px-3 rounded-[1000px] bg-white/10 cursor-pointer"
                  onClick={() => onClose()}
                >
                  <FiX />
                </div>
              </ModalHeader>

              <ModalBody {...bodyProps}>{children}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
