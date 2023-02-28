import styles from "../../assets/scss/sidebar.module.scss";
import classNames from "classnames/bind";
import { Image } from "../../components/Image";
import HeadlessTippy from "@tippyjs/react/headless";
import { NotificationIcon } from "../../components";
import { AccountItem, AccountMessage } from "../../components/Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks";
import { Wrapper as PopperWrapper } from "../../components";
import { useContext } from "react";
import { UserContext } from "../../providers";
import { handleSearch, getListMessage } from "../../services/dashboard";
import { IMessage } from "../../types";

const cx = classNames.bind(styles);
const Sidebar = () => {
  const currentUser = useContext(UserContext);
  const [valueSearch, setValueSearch] = useState("");
  const debounceValue = useDebounce(valueSearch, 500);
  const [listUserSearch, setListSearch] = useState([]);
  const [listMessage, setListMessage] = useState([]);

  const uniqueSender = Array.from(
    new Map(
      listMessage.map((message: IMessage) => [message?.senderID?._id, message])
    ).values()
  );

  const uniqueMessage = uniqueSender.filter(
    (message) => message.senderID._id !== currentUser._id
  );

  useEffect(() => {
    if (!debounceValue.trim()) {
      return;
    }
    handleSearch(debounceValue)
      .then((response) => {
        setListSearch(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [debounceValue]);

  useEffect(() => {
    getListMessage()
      .then((response) => {
        setListMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <div className={cx("header__content")}>
          <Image width="50px" height="50px" src={currentUser.avatar} />
          <h1 className={cx("header__content--title")}>
            {currentUser.username}
          </h1>
        </div>
        <div className={cx("header__notification")}>
          <NotificationIcon width="45px" height="45px" />
          <span>1</span>
        </div>
      </div>
      <HeadlessTippy
        trigger="click"
        appendTo={document.body}
        placement="bottom"
        interactive
        render={(attrs) => (
          <div className={cx("search-result")} tabIndex={1} {...attrs}>
            <PopperWrapper className={cx("popper-search")}>
              <h4 className={cx("search-title")}>accounts</h4>
              {listUserSearch.map((user, index) => {
                return (
                  <AccountItem
                    key={index}
                    listMessage={listMessage}
                    searchUser={user}
                  />
                );
              })}
            </PopperWrapper>
          </div>
        )}
      >
        <div className={cx("status")}>
          <div className={cx("status__search")}>
            <FontAwesomeIcon
              className={cx("status__search--icon-search")}
              icon={faSearch}
            />
            <input
              onChange={(e) => {
                setValueSearch(e.currentTarget.value);
              }}
              value={valueSearch}
              type="text"
              placeholder="Search"
            />
            <FontAwesomeIcon
              className={cx("status__search--icon-delete")}
              icon={faDeleteLeft}
              onClick={() => {
                setValueSearch("");
              }}
            />
          </div>
          {/* <div className={cx("status__content")}>
            <span className={cx("status__content--title", "text-white")}>
              Favorites
            </span>
            <div className={cx("status__list")}>
              {listUserSearch.map((user, index) => {
                return (
                  <AccountItem
                    onClick={() => {
                      alert("hello!");
                    }}
                    key={index}
                    listMessage={uniMessageCurrentUser}
                    searchUser={user}
                  />
                );
              })}
            </div>
          </div> */}
        </div>
      </HeadlessTippy>
      <div className={cx("message__list")}>
        {uniqueMessage.map((message: IMessage, index) => {
          return (
            <AccountMessage
              className={cx("message-item")}
              key={index}
              listMessage={listMessage}
              message={message}
              searchUser={
                message.senderID === currentUser
                  ? message.receiverID
                  : message.senderID
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export { Sidebar };