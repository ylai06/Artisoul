import { Button, Modal, Input, Spin, DatePicker } from "antd";
import { Header } from "../../components/header";
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import sunset from "../../img/nft/sunset.jpg";
import avatarImg from "../../img/nft/avaExample.jpg";
import { SolidProfileShapeShapeType } from "../../.ldo/solidProfile.shapeTypes";
import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { changeData, commitData } from "@ldo/solid";
import "./account.scss";
import dayjs from "dayjs";
import { use } from "chai";

function Account() {
  const { session } = useSolidAuth();
  const resource = useResource(session.webId);
  const profile = useSubject(SolidProfileShapeShapeType, session.webId);

  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dateFormat = "YYYY-MM-DD";

  const [user, setUser] = useState({
    name: "",
    email: "",
    webId: session.webId,
    birthday: "",
    bio: "",
    connectWallet: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    userImg: avatarImg,
    userBackgroundImg: sunset,
  });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    birthDate: user.birthday,
    bio: user.bio,
  });

  const showModal = () => {
    setFormData({
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      bio: user.bio,
    });
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!profile || !resource) return;
    setIsSaving(true);
    const cProfile = changeData(profile, resource);
    if (formData.name) cProfile.fn = formData.name;
    if (formData.email) cProfile.email = formData.email;
    if (formData.birthDate) cProfile.birthDate = formData.birthDate;
    if (formData.bio) cProfile.bio = formData.bio;
    try {
      await commitData(cProfile);
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        birthday: formData.birthDate || user.birthday,
        bio: formData.bio,
      });
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const disabledDate = (current) => {
    const today = dayjs();
    const maxDate = dayjs().subtract(120, "years");
    return current && (current > today || current < maxDate);
  };

  useEffect(() => {
    if (profile) {
      setUser({
        ...user,
        name: profile.fn,
        email: profile.email,
        birthday: profile.birthDate,
        bio: profile.bio,
      });
    }
  }, [profile]);

  return (
    <div className="P-account">
      <Header />
      <div
        className="user-background"
        style={{ backgroundImage: `url(${user.userBackgroundImg})` }}
      >
        Background
      </div>
      <div className="avatar">
        <div
          className="a-img"
          style={{ backgroundImage: `url(${user.userImg})` }}
        ></div>
        <h2>{user.name || "No Name"} </h2>
      </div>
      <div className="user-detail">
        <div className="d-flex align-items-center justify-content-between">
          <div className="info-item">
            <p>WebID</p>
            <span>{user.webId}</span>
          </div>
          <div>
            <div className="ipt-con">
              <button className="login-btn" onClick={showModal}>
                Edit Profile
              </button>
              <Link to="/mintNFT">
                <button className="login-btn">My NFTs</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="info-item me-5">
            <p>Email</p>
            <span>{user.email || "No Email"} </span>
          </div>
          <div className="info-item">
            <p>Birth Date</p>
            <span>{user.birthday || "Unknown"} </span>
          </div>
        </div>
        <div className="info-item">
          <p>Bio</p>
          <span>{user.bio || "No Bio"}</span>
        </div>
        <div className="info-item">
          <p>Wallet Address</p>
          <span>{user.connectWallet}</span>
        </div>
      </div>

      <Modal
        title="Edit Solid Profile"
        open={open}
        onCancel={handleCancel}
        onOk={handleSave}
        footer={[
          <Button key="back" onClick={handleCancel}>
            cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSaving}
            onClick={handleSave}
          >
            save
          </Button>,
        ]}
      >
        <Spin spinning={isSaving}>
          <div className="modal-form">
            <div className="form-item">
              <p>User name</p>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="form-item">
              <p>Email</p>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form-item">
              <p>Birthday</p>
              <DatePicker
                defaultValue={
                  formData.birthDate === undefined
                    ? dayjs()
                    : dayjs(formData.birthDate, dateFormat)
                }
                onChange={(date, dateString) =>
                  setFormData({
                    ...formData,
                    birthDate: dateString,
                  })
                }
                disabledDate={disabledDate}
              />
            </div>
            <div className="form-item">
              <p>Biography</p>
              <Input.TextArea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  );
}

export default Account;
