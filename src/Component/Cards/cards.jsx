import { useEffect, useState } from "react";
import DashboardCardsData from "./dashboardCardsData.js";
import Companiesdata from "../Company/companyTable.js";

const STORAGE_KEY = "worknest_companies";

export default function DashboardCards({ stats, companies: propCompanies }) {
  const [localCompanies, setLocalCompanies] = useState([]);
  const companies = propCompanies || localCompanies;

  const loadCompanies = () => {
    if (propCompanies) return;
    try {
      const savedCompanies = localStorage.getItem(STORAGE_KEY);

      if (savedCompanies === null) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Companiesdata)
        );

        setLocalCompanies(Companiesdata);
        return;
      }

      const parsedCompanies = JSON.parse(savedCompanies);

      if (Array.isArray(parsedCompanies)) {
        setLocalCompanies(parsedCompanies);
        return;
      }

      setLocalCompanies(Companiesdata);
    } catch (error) {
      console.error("Error loading companies:", error);
      setLocalCompanies(Companiesdata);
    }
  };

  useEffect(() => {
    if (propCompanies) return;
    loadCompanies();

    const handleCompaniesUpdated = (event) => {
      if (event.detail) {
        setLocalCompanies(event.detail);
      } else {
        loadCompanies();
      }
    };

    window.addEventListener(
      "companiesUpdated",
      handleCompaniesUpdated
    );

    window.addEventListener(
      "storage",
      loadCompanies
    );

    return () => {
      window.removeEventListener(
        "companiesUpdated",
        handleCompaniesUpdated
      );

      window.removeEventListener(
        "storage",
        loadCompanies
      );
    };
  }, [propCompanies]);

  // =========================
  // COMPANY COUNTS
  // =========================

  const totalCompanies = companies.length;

  const activeCompanies = companies.filter(
    (company) => company.status === "Active"
  ).length;

  const pendingCompanies = companies.filter(
    (company) => company.status === "Pending"
  ).length;

  const suspendedCompanies = companies.filter(
    (company) =>
      company.status === "Failed" ||
      company.status === "Inactive"
  ).length;

  // =========================
  // EMPLOYEES
  // =========================

  const activeEmployees = companies.reduce(
    (total, company) => {
      const size = String(company.size || "0");

      const numbers = size.match(/\d+/g);

      const employeeNumber =
        numbers && numbers.length > 0
          ? Number(numbers[0])
          : 0;

      return total + employeeNumber;
    },
    0
  );

  // =========================
  // REVENUE
  // =========================

  const monthlyRevenue = companies.reduce(
    (total, company) => {
      const revenue = String(
        company.revenue || "0"
      );

      const numbers =
        revenue.match(/\d+(\.\d+)?/g);

      const revenueNumber =
        numbers && numbers.length > 0
          ? Number(numbers[0])
          : 0;

      return total + revenueNumber;
    },
    0
  );

  // =========================
  // PAID COMPANIES
  // =========================

  const paidCompanies = companies.filter(
    (company) =>
      company.paymentStatus === "Paid"
  ).length;

  // =========================
  // NEW THIS MONTH
  // =========================

  const currentDate = new Date();

  const newCompanies = companies.filter(
    (company) => {
      if (!company.createdAt) {
        return false;
      }

      const createdDate = new Date(
        company.createdAt
      );

      return (
        createdDate.getMonth() ===
          currentDate.getMonth() &&
        createdDate.getFullYear() ===
          currentDate.getFullYear()
      );
    }
  ).length;

  // =========================
  // CARD VALUES
  // =========================

  const cardValues = {
    totalUsers: stats?.total_users ?? activeEmployees,

    monthlyRevenue: `$${monthlyRevenue.toLocaleString(
      "en-US"
    )}`,

    totalCompanies: stats?.total_companies ?? totalCompanies,

    activeEmployees: stats?.total_users ?? activeEmployees,

    pendingCompanies,

    suspendedCompanies,

    paidCompanies,

    newCompanies,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {DashboardCardsData.map((card, index) => {
        const Icon = card.icon;

        const value =
          cardValues[card.key] ?? 0;

        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >

            <div className="flex justify-between items-start gap-4">

              <div>

                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>

                <h2 className="text-3xl font-bold text-gray-900 mt-3">
                  {value}
                </h2>

                <div className="flex items-center gap-2 mt-3">

                  <span
                    className={`text-sm font-semibold ${card.color}`}
                  >
                    {card.change}
                  </span>

                  <span className="text-xs text-gray-500">
                    Last Month
                  </span>

                </div>

              </div>

              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#a3feff]/40 text-[#016472] shrink-0">
                <Icon size={22} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}