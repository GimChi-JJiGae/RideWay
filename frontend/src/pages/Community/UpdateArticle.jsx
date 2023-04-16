/* eslint-disable */
import { Editor } from '@toast-ui/react-editor';
import styled from 'styled-components';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import { UPDATE_BOARD_REQUEST } from '../../store/modules/communityModule';
import { BASE_URL } from '../../utils/urls';
import NowContainer from '../../components/commons/nowLocation';

const StyledButton = styled.button`
  width: ${props => (props.width ? props.width : '10rem')};
  height: ${props => (props.height ? props.height : '2rem')};
  font-size: ${props => (props.fontSize ? props.fontSize : '1rem')};
  color: ${props => (props.color ? props.color : '')};
  background-color: ${props => (props.bc ? props.bc : '#c4c4c4')};
  margin-top: ${props => (props.mt ? props.mt : '')};
  margin-left: ${props => (props.ml ? props.ml : '')};
  margin-bottom: ${props => (props.mb ? props.mb : '')};
  margin-right: ${props => (props.mr ? props.mr : '')};
  padding: ${props => (props.padding ? props.padding : '')};
  /* border: 'solid 0.5px'; */
  border: ${props => (props.border ? props.border : 'solid 0.5px')};
  border-color: #a3a3a3;
  border-radius: ${props => (props.br ? props.br : '5px')};
  font-family: ${props => (props.font ? props.font : 'Pretendard-SemiBold')};
  z-index: ${props => (props.z ? props.z : '')};
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    transition: 0.3s;
    background-color: ${props =>
      props.hoverColor ? props.hoverColor : '#a2a2a2'};
  }

  &:disabled {
    background-color: whitesmoke;
    cursor: no-drop;
  }
`;

const Button = props => (
  <StyledButton {...props} disabled={props.disabled}>
    {props.name}
  </StyledButton>
);

const StyleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledCommentInput = styled.input`
  width: ${props => (props.width ? props.width : '95%')};
  height: ${props => (props.height ? props.height : '2rem')};
  border-radius: ${props => (props.br ? props.br : '5px')};
  border: 1px solid #a3a3a3;
  padding-left: 1rem;
  font-size: 1.3rem;
  margin-top: ${props => (props.mt ? props.mt : '')};
  margin-left: ${props => (props.ml ? props.ml : '')};
  margin-bottom: ${props => (props.mb ? props.mb : '')};
  margin-right: ${props => (props.mr ? props.mr : '')};
  font-family: 'Pretendard-Regular';
  width: 68.7vw;
  padding: 0.5rem;
`;

const UpdateArticle = () => {
  const { state } = useLocation();
  // console.log(state);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [boardCode, setBoardCode] = useState('');
  const userToken = sessionStorage.getItem('userToken');

  //   const { user } = useSelector(state => state.myPage);

  const editorRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contentChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setContent(data);
    // console.log(data);
  };

  const titleChange = e => {
    setTitle(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    dispatch({
      type: UPDATE_BOARD_REQUEST,
      data: {
        title,
        content,
        board_id: state.boardId,
        boardCode: state.boardCode,
        token: userToken,
        navigate,
      },
    });
  };

  const onClick = () => {
    navigate(`/community/free/detail`, {
      state: { boardId: state.boardId, boardCode: state.boardCode },
    });
  };

  useEffect(() => {
    setTitle(state.title);
    // setBoardCode(state.boardCode);
    setContent(state.content);
  }, []);

  return (
    <div>
      <NowContainer desc="커 뮤 니 티" />
      {content && (
        <StyleContainer>
          <span style={{ height: '35px' }}></span>
          <form onSubmit={onSubmit}>
            <div>
              <StyledCommentInput
                required
                value={title}
                onChange={titleChange}
                id="title"
                type="text"
                placeholder="제목을 입력해주세요."
              />
            </div>
            <hr />
            <div style={{ width: '70vw' }}>
              <Editor
                placeholder="내용을 입력해주세요."
                initialValue={content}
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                plugins={[colorSyntax]}
                language="ko-KR"
                ref={editorRef}
                onChange={contentChange}
                hooks={{
                  addImageBlobHook: async (blob, callback) => {
                    const formData = new FormData();
                    formData.append('imageFile', blob);

                    await axios({
                      method: 'post',
                      url: `${BASE_URL}board/imageUpload`,
                      data: formData,
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                      .then(res => {
                        const imageUrl = res.data;
                        const url = `${BASE_URL}board/imageDownload/${imageUrl}`;
                        callback(url, 'image');
                      })
                      .catch(err => {
                        console.log(err);
                      });
                    return false;
                  },
                }}
              />
            </div>
            <hr />
            <Button
              width="5rem"
              ml="0.1rem"
              mr="0.1rem"
              mt="0.2rem"
              height="2.3rem"
              bc="white"
              name="수정"
            />
            <Button
              width="5rem"
              ml="0.1rem"
              mr="0.1rem"
              mt="0.2rem"
              height="2.3rem"
              bc="white"
              name="취소"
              onClick={onClick}
            ></Button>
          </form>
        </StyleContainer>
      )}
      <div style={{ height: '20px' }}></div>
    </div>
  );
};
export default UpdateArticle;
