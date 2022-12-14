import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { SetStateAction, useCallback } from "react";
import InputField from "../InputField";
import { darkTheme } from "../../../styles/color";
import { Button } from "../Button";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: darkTheme.sideBg,
  color: darkTheme.primaryText,
  borderColor: darkTheme.sideBg,
  boxShadow: 24,
  borderRadius: "8px",
  p: 3,
};

// types
type AddModalProps = {
  title: string;
  ButtonText: string;
  action: () => void;
  openStatus: boolean;
  onClose: () => void;
  setKeyword: any;
};

const AddModal = ({
  title,
  ButtonText,
  action,
  openStatus,
  onClose,
  setKeyword,
}: AddModalProps) => {

  const changeEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e?.target?.value ?? e?.currentTarget?.value ?? '')
    }
  , [setKeyword])
  return (
    <Modal
      open={openStatus}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ fontWeight: "600" }}
        >
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <InputField
            name="board_name"
            label="Board Name"
            placeholder="eg. Web Design"
            onChange={changeEvent}
          />
          <Button fullSize margin="2rem auto 0" onClick={action}>
            {ButtonText}
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

export default AddModal;
