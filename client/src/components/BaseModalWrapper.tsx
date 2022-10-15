import React, {PropsWithChildren} from "react";
import {NewRoomModal} from "./NewRoomModal";
import {DesktopModalContainer, Header} from "./StyledComponents/ModalPopup.style";


interface BaseModalWrapperProps extends PropsWithChildren {
    isModalVisible: boolean;
    onBackDropClick: () => void;
}

export const BaseModalWrapper: React.FC<BaseModalWrapperProps> = ({onBackDropClick, isModalVisible}) => {
    if (!isModalVisible) {
        return null;
    }

    return (<NewRoomModal onBackDropClick={onBackDropClick} children={<DesktopModalContainer>
        <Header>
            Modal
        </Header>
    </DesktopModalContainer>}/>)
}
