import Image from "next/image";

const AudienceCardLayout = ({ children, imageurl }) => {
  return (
    <div className="p-3 pb-0">
      <div className="flex relative">
        <Image
          className="max-w-[210px] absolute right-[-70px] top-[-46px] z-10"
          src={imageurl ? imageurl : "/imoje-charecters/raven-prof.png"}
          priority={true}
          width={400}
          height={450}
          alt="Raven Stop"
        />
        <div className="bg-white text-ui-dark-gray w-[330px] h-[128px] relative left-[0px] rounded-tl-md rounded-bl-md"></div>
        <div className="bg-transparent text-ui-dark-gray w-[330px] h-[118px] absolute left-[0px] rounded-tl-md rounded-bl-md z-20">
          <div className="mr-[30px] px-2 py-2 flex flex-col justify-between h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceCardLayout;
