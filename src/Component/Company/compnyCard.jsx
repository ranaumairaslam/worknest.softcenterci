import { companyCards } from "./companyCardData";
import { Link } from "react-router-dom";

export default function CompanyCards({ companies = [] }) {

  // ==============================
  // COMPANY COUNTS
  // ==============================

  const totalCompanies =
    companies.length;

  const activeCompanies =
    companies.filter(
      (company) =>
        company.status === "Active"
    ).length;

  const pendingCompanies =
    companies.filter(
      (company) =>
        company.status === "Pending"
    ).length;

  const suspendedCompanies =
    companies.filter(
      (company) =>
        company.status === "Failed" ||
        company.status === "Inactive"
    ).length;

  // ==============================
  // TOTAL EMPLOYEES
  // ==============================

  const totalEmployees =
    companies.reduce(
      (total, company) => {
        const size = String(
          company.size || "0"
        );

        const numbers =
          size.match(/\d+/g);

        const employeeNumber =
          numbers &&
          numbers.length > 0
            ? Number(numbers[0])
            : 0;

        return total + employeeNumber;
      },
      0
    );

  // ==============================
  // NEW THIS MONTH
  // ==============================

  const currentDate = new Date();

  const newThisMonth =
    companies.filter((company) => {
      if (!company.createdAt) {
        return false;
      }

      const createdDate =
        new Date(company.createdAt);

      return (
        createdDate.getMonth() ===
          currentDate.getMonth() &&
        createdDate.getFullYear() ===
          currentDate.getFullYear()
      );
    }).length;

  // ==============================
  // CARD VALUES
  // ==============================

  const cardValues = {
    total: totalCompanies,
    active: activeCompanies,
    new: newThisMonth,
    employees: totalEmployees,
    pending: pendingCompanies,
    suspended: suspendedCompanies,
  };


  return (
    <div className="w-full p-4 sm:p-6">

      

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Company Management
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            Manage all registered companies across the platform.
          </p>
        </div>

        <Link
          to="/add-company"
          className="w-full sm:w-auto bg-[#016472] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#01535e] transition text-center"
        >
          + Add Company
        </Link>

      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 ">

        {companyCards.map((card) => {

          const Icon = card.icon;

          const value =
            cardValues[card.key] ?? 0;

          // Progress
          let progress = 0;

          if (totalCompanies > 0) {
            if (card.key === "total") {
              progress = 100;
            } else {
              progress = Math.min(
                100,
                (value / totalCompanies) * 100
              );
            }
          }

          return (
            <div
              key={card.key}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* TOP */}

              <div className="flex justify-between items-start gap-3">

                <div className="min-w-0">

                  <h3 className="text-sm font-medium text-gray-500">
                    {card.title}
                  </h3>

                  <h2 className="text-3xl font-bold text-gray-900 mt-3">
                    {value}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {card.subTitle}
                  </p>

                </div>

                {/* ICON */}

                <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center bg-[#a3feff]/40 text-[#016472]">

                  <Icon
                    size={22}
                    className="text-[#016472]"
                  />

                </div>

              </div>

              {/* TREND */}

              <div className="flex items-center gap-2 mt-4">

                <span
                  className={`${card.trendColor} text-sm font-semibold`}
                >
                  {card.trend}
                </span>

                <span className="text-xs text-gray-500">
                  Last Month
                </span>

              </div>

              {/* PROGRESS */}

              <div className="mt-4">

                <div className="w-full h-2 rounded-full bg-gray-200">

                  <div
                    className="h-2 rounded-full bg-[#016472] transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* TOTAL */}

      <div className="mt-5 text-sm text-gray-500">

        Total Companies:{" "}

        <span className="font-semibold text-gray-800">
          {totalCompanies}
        </span>

      </div>

    </div>
  );
}
