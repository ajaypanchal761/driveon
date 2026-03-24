import { useMemo, useState } from "react";
import { colors } from "../../../module/theme/colors";
import Card from "../../../components/common/Card";

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatMoney = (amount) => {
  const number = Number(amount);
  if (!Number.isFinite(number)) return "₹0";
  return number.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

const getStatusMeta = (status) => {
  switch (status) {
    case "running":
      return { label: "Running", bg: "#E8F5E9", fg: colors.success, dot: colors.success };
    case "booked":
      return { label: "Booked", bg: "#FFF3E0", fg: colors.warning, dot: colors.warning };
    case "completed":
      return { label: "Completed", bg: "#F3F4F6", fg: colors.textSecondary, dot: colors.textSecondary };
    case "cancelled":
      return { label: "Cancelled", bg: "#FFEBEE", fg: colors.error, dot: colors.error };
    default:
      return { label: status || "N/A", bg: "#F3F4F6", fg: colors.textSecondary, dot: colors.textSecondary };
  }
};

// Frontend-only mock data (online bookings only; fleet excluded)
const MOCK_ONLINE_BOOKED_CARS = [
  {
    id: "OC-001",
    isFleet: false,
    car: {
      id: "CAR-THAR-001",
      name: "MAHINDRA N MAHINDRA THAR 4*2 2024",
      numberPlate: "GJ01AB1234",
      city: "Ahmedabad",
      fuel: "Diesel",
      transmission: "Manual",
      seats: 5,
    },
    booking: {
      bookingId: "BK745750AV6",
      status: "running",
      user: {
        name: "Ajay Panchal",
        email: "ajaypanchal@example.com",
        phone: "+91 90000 00000",
      },
      tripStart: {
        dateTime: "2026-03-11T18:38:00+05:30",
        location: "Ahmedabad",
      },
      tripEnd: {
        dateTime: "2026-03-12T10:30:00+05:30",
        location: "Ahmedabad",
      },
      pricing: {
        pricePerDay: 5000,
        days: 1,
        discount: 0,
        extraCharges: 0,
        totalAmount: 5000,
      },
      paymentStatus: "paid",
    },
  },
  {
    id: "OC-002",
    isFleet: false,
    car: {
      id: "CAR-CRETA-002",
      name: "HYUNDAI CRETA 2023",
      numberPlate: "GJ27CD9876",
      city: "Ahmedabad",
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
    },
    booking: {
      bookingId: "BK120045XZ1",
      status: "booked",
      user: {
        name: "Riya Shah",
        email: "riya.shah@example.com",
        phone: "+91 91111 11111",
      },
      tripStart: {
        dateTime: "2026-03-26T09:00:00+05:30",
        location: "Ahmedabad",
      },
      tripEnd: {
        dateTime: "2026-03-28T09:00:00+05:30",
        location: "Ahmedabad",
      },
      pricing: {
        pricePerDay: 3200,
        days: 2,
        discount: 200,
        extraCharges: 0,
        totalAmount: 6200,
      },
      paymentStatus: "pending",
    },
  },
  {
    id: "OC-003",
    isFleet: false,
    car: {
      id: "CAR-SWIFT-003",
      name: "MARUTI SWIFT 2022",
      numberPlate: "GJ05EF4567",
      city: "Ahmedabad",
      fuel: "Petrol",
      transmission: "Manual",
      seats: 5,
    },
    booking: {
      bookingId: "BK998877AA0",
      status: "completed",
      user: {
        name: "Kunal Mehta",
        email: "kunal.mehta@example.com",
        phone: "+91 92222 22222",
      },
      tripStart: {
        dateTime: "2026-03-05T10:00:00+05:30",
        location: "Ahmedabad",
      },
      tripEnd: {
        dateTime: "2026-03-06T10:00:00+05:30",
        location: "Ahmedabad",
      },
      pricing: {
        pricePerDay: 1800,
        days: 1,
        discount: 0,
        extraCharges: 150,
        totalAmount: 1950,
      },
      paymentStatus: "paid",
    },
  },
];

const OnlineCarsPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const onlineCars = useMemo(() => {
    return (MOCK_ONLINE_BOOKED_CARS || []).filter((item) => !item.isFleet);
  }, []);

  const openDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Online Cars
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            All online-booked cars (fleet excluded), with current booking status.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: colors.backgroundLight }}>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Car
                </th>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Booking ID
                </th>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Status
                </th>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  User
                </th>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Trip
                </th>
                <th className="text-left text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Amount
                </th>
                <th className="text-right text-xs font-semibold px-4 py-3" style={{ color: colors.textSecondary }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {onlineCars.map((item) => {
                const statusMeta = getStatusMeta(item?.booking?.status);
                return (
                  <tr
                    key={item.id}
                    className="border-t"
                    style={{ borderTopColor: colors.borderMedium }}
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {item?.car?.name || "N/A"}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        {item?.car?.numberPlate || "N/A"} • {item?.car?.city || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium" style={{ color: colors.textPrimary }}>
                        {item?.booking?.bookingId || "N/A"}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        Payment: {item?.booking?.paymentStatus || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: statusMeta.bg, color: statusMeta.fg }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusMeta.dot }} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium" style={{ color: colors.textPrimary }}>
                        {item?.booking?.user?.name || "N/A"}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        {item?.booking?.user?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm" style={{ color: colors.textPrimary }}>
                        {formatDateTime(item?.booking?.tripStart?.dateTime)}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        to {formatDateTime(item?.booking?.tripEnd?.dateTime)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {formatMoney(item?.booking?.pricing?.totalAmount)}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        {item?.booking?.pricing?.days || 0} day(s)
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openDetails(item)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border transition-colors"
                        style={{
                          color: colors.backgroundTertiary,
                          borderColor: colors.borderMedium,
                          backgroundColor: colors.backgroundSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.backgroundLight;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {onlineCars.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-sm" colSpan={7} style={{ color: colors.textSecondary }}>
                    No online booked cars found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showDetails && selectedItem && (
        <BookingDetailsModal item={selectedItem} onClose={closeDetails} />
      )}
    </div>
  );
};

const InfoRow = ({ label, value, isLast = false }) => {
  return (
    <div
      className={`py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 ${isLast ? "" : "border-b"}`}
      style={!isLast ? { borderBottomColor: colors.borderMedium } : undefined}
    >
      <div className="text-sm font-medium" style={{ color: colors.textSecondary }}>
        {label}
      </div>
      <div className="text-sm sm:text-right break-words" style={{ color: colors.textPrimary }}>
        {value}
      </div>
    </div>
  );
};

const BookingDetailsModal = ({ item, onClose }) => {
  const statusMeta = getStatusMeta(item?.booking?.status);
  const pricing = item?.booking?.pricing || {};
  const baseAmount = (Number(pricing.pricePerDay) || 0) * (Number(pricing.days) || 0);
  const discount = Number(pricing.discount) || 0;
  const extraCharges = Number(pricing.extraCharges) || 0;
  const totalAmount = Number(pricing.totalAmount) || Math.max(0, baseAmount - discount + extraCharges);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border"
        style={{ borderColor: colors.borderMedium }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between gap-4"
          style={{ borderBottomColor: colors.borderMedium }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold truncate" style={{ color: colors.textPrimary }}>
                {item?.booking?.bookingId || "N/A"}
              </h2>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: statusMeta.bg, color: statusMeta.fg }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusMeta.dot }} />
                {statusMeta.label}
              </span>
            </div>
            <p className="text-sm mt-1 truncate" style={{ color: colors.textSecondary }}>
              {item?.car?.name || "N/A"} • {item?.car?.numberPlate || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close"
          >
            <svg className="w-6 h-6" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Car Information
              </h3>
              <div>
                <InfoRow label="Car" value={item?.car?.name || "N/A"} />
                <InfoRow label="Number Plate" value={item?.car?.numberPlate || "N/A"} />
                <InfoRow label="City" value={item?.car?.city || "N/A"} />
                <InfoRow label="Fuel" value={item?.car?.fuel || "N/A"} />
                <InfoRow label="Transmission" value={item?.car?.transmission || "N/A"} />
                <InfoRow label="Seats" value={item?.car?.seats ?? "N/A"} isLast />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Booking & User
              </h3>
              <div>
                <InfoRow label="User" value={item?.booking?.user?.name || "N/A"} />
                <InfoRow label="Email" value={item?.booking?.user?.email || "N/A"} />
                <InfoRow label="Phone" value={item?.booking?.user?.phone || "N/A"} />
                <InfoRow label="Payment Status" value={item?.booking?.paymentStatus || "N/A"} isLast />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Trip Details
              </h3>
              <div>
                <InfoRow
                  label="Trip Start"
                  value={`${formatDateTime(item?.booking?.tripStart?.dateTime)} • ${item?.booking?.tripStart?.location || "N/A"}`}
                />
                <InfoRow
                  label="Trip End"
                  value={`${formatDateTime(item?.booking?.tripEnd?.dateTime)} • ${item?.booking?.tripEnd?.location || "N/A"}`}
                />
                <InfoRow label="Duration" value={`${pricing?.days || 0} day(s)`} isLast />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Pricing Breakdown
              </h3>
              <div>
                <InfoRow label="Price per day" value={formatMoney(pricing?.pricePerDay)} />
                <InfoRow label="Days" value={pricing?.days || 0} />
                <InfoRow label="Base Amount" value={formatMoney(baseAmount)} />
                <InfoRow label="Discount" value={formatMoney(discount)} />
                <InfoRow label="Extra Charges" value={formatMoney(extraCharges)} />
                <div
                  className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between gap-6"
                  style={{ backgroundColor: colors.backgroundLight }}
                >
                  <div className="text-base font-bold" style={{ color: colors.textPrimary }}>
                    Total Amount
                  </div>
                  <div className="text-base font-bold" style={{ color: colors.textPrimary }}>
                    {formatMoney(totalAmount)}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold border transition-colors"
              style={{
                color: colors.textPrimary,
                borderColor: colors.borderMedium,
                backgroundColor: colors.backgroundSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineCarsPage;
