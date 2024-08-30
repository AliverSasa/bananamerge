import { UserInfo } from "../../store/user";
import { isEmpty, isNil } from "ramda";
import { environment } from "../../utils/environments";

type Iprops = {
  userInfo?: UserInfo;
  onProfileDetail?: (address: string) => void;
  size?: string;
  borderRadius?: string;
  isHasWuKong?:boolean
};

const CustomAvatar = ({
  userInfo,
  onProfileDetail,
  size = "48px",
  borderRadius,
  isHasWuKong
}: Iprops) => {
  const hasName = !isNil(userInfo?.name) && !isEmpty(userInfo?.name);
  const hasAvatar = !isNil(userInfo?.avatar) && !isEmpty(userInfo?.avatar);
  const userAlt = hasName
    ? userInfo.name.slice(0, 2)
    : (userInfo?.metaid ?? "").slice(0, 4);
  const src = `${environment.base_man_url}${userInfo?.avatar ?? ""}`;
  return (
    <div
      onClick={() =>
        onProfileDetail && onProfileDetail(userInfo?.address ?? "")
      }
      className="z-50"
    >
      {hasAvatar ? (
        <img
          src={isHasWuKong?'https://man.metaid.io/content/69e3011f06160343a94480f4507f5bb6338edbcacd59d9decb61085e8916f6d1i0':src}
          alt="user avatar"
          className="self-start cursor-pointer"
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            borderRadius: borderRadius,
          }}
        />
      ) : ( isHasWuKong?(
        <img
        src={'https://man.metaid.io/content/69e3011f06160343a94480f4507f5bb6338edbcacd59d9decb61085e8916f6d1i0'}
          alt="user avatar"
          className="self-start cursor-pointer"
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            borderRadius: borderRadius,
          }}
        />
      ):(
        <div className="avatar placeholder cursor-pointer">
        <div
          className="bg-[#2B3440] text-[#D7DDE4]"
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            borderRadius: borderRadius,
          }}
        >
          <span>{userAlt}</span>
        </div>
      </div>
      )
       
      )}
    </div>
  );
};

export default CustomAvatar;
