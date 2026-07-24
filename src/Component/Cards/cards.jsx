export default function Cards() {
  const cards = [
    {
      title: "Active Tenants",
      value: "128",
      subTitle: "Active Clients",
    },
    {
      title: "Total Platform Users",
      value: "4.5k",
      subTitle: "Registered Users",
    },
    {
      title: "Global System Health",
      value: "99.9%",
      subTitle: "Uptime Status",
      green: true,
    },
    {
      title: "ARR / Revenue",
      value: "$45",
      subTitle: "Monthly Revenue",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6 mt-8 sm:mt-12 lg:mt-[0px]">

              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
          <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold text-[rgb(9,7,7)]">
            GLOBAL PLATFORM OVERVIEW
          </h2>

          <span className="w-fit bg-[#016472] text-[#a3feff] py-[5px] px-3 rounded-md text-[11px] sm:text-[12px]">
            FR-1.3
          </span>
        </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className={
              card.green
                ? "bg-[#0b5f42] border border-[#18b47b] rounded-xl p-5 lg:p-[22px] min-h-[150px] transition-all duration-300 hover:-translate-y-3"
                : "bg-[#102845] border border-[#1c4261] rounded-xl p-5 lg:p-[22px] min-h-[150px] transition-all duration-300 hover:-translate-y-3"
            }
          >
            <h4 className="text-white text-[14px] sm:text-[15px] lg:text-[16px] mb-5">
              {card.title}
            </h4>

            <h1 className="text-white text-[32px] sm:text-[40px] lg:text-[48px] mb-3 font-bold">
              {card.value}
            </h1>

            <p className="text-white text-[13px] sm:text-[14px]">
              {card.subTitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}