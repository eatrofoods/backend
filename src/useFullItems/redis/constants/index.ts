import { CronJob } from "cron";
import { Order } from "../functions";
import { DateTime } from "luxon";
import { constants } from "src/useFullItems/constants";

// const getYesterday = () => {
//   const currentDate = new Date();
//   const getTodaysDate = currentDate.getDate();
//   if (getTodaysDate === 1) {
//     const getCurrentMonth = currentDate.getMonth() + 1; //because jan is 0 and dec is 11
//     if (getCurrentMonth === 1) return 31;
//     else {
//       return new Date(
//         currentDate.getFullYear(),
//         getCurrentMonth - 1,
//         0,
//         5,
//         30,
//       ).getDate();
//     }
//   } else {
//     return getTodaysDate - 1;
//   }
// };

const dayTrackerHOF_Function = () => {
  const dayTracker: { today: number; yesterday: number } = {
    today: DateTime.now().setZone(constants.IndiaTimeZone).get("day"),
    yesterday: DateTime.now().setZone(constants.IndiaTimeZone).minus({ day: 1 }).get("day"),
  };

  new CronJob(
    "0 0 0 * * *",
    function () {
      dayTracker.yesterday = dayTracker.today;
      dayTracker.today = DateTime.now().setZone(constants.IndiaTimeZone).get('day');
    },
    null,
    true,
    constants.IndiaTimeZone,
  );

  return (day: "Today" | "Yesterday") => {
    if (day === "Today") return dayTracker.today;
    else if (day === "Yesterday") return dayTracker.yesterday;
  };
};

export const dayTracker = dayTrackerHOF_Function();

export const redisConstants = {
  tablesStatusKey: (restaurantId: string) =>
    `${restaurantId}:restaurantSession`,

  tableSessionKeyForTablesStatus: (
    tableSectionId: string,
    tableNumber: number,
  ) => `${tableSectionId}:${tableNumber}:tableSession`,

  orderKey: (orderUUID: string) => `${orderUUID}:order`,

  sessionKey: (sessionUUID: string) => `${sessionUUID}:session`,

  restaurantRealtimeOrdersContainer_Today_Key: (restaurantId: string) =>
    `${restaurantId}:${dayTracker("Today")}:OrdersContainer`,

  restaurantRealtimeOrdersContainer_Yesterday_Key: (restaurantId: string) =>
    `${restaurantId}:${dayTracker("Yesterday")}:OrdersContainer`,

  cartSessionKey: (sessionUUID: string) => `${sessionUUID}:cart`,
};

export const redisKeyExpiry = {
  orderKey: 60 * 60 * 49,
  // sessionKey: 60 * 60 * 24, finish them imitiately after session is finish
  restaurantRealtimeOrdersContainerKey: 60 * 60 * 48,
  // cartSession: 60 * 60 * 24,finish them imitiately after session is finish
};

// export const redisFunctions = {
//   createOrder: (orderUUID:string) => redisClient.HSET(redisConstants.orderKey(orderUUID),[])
// };

export const orderConstants: Omit<Order, "size"> & { size: string } = {
  dishId: "dishId",
  orderId: "orderId",
  tableNumber: "tableNumber",
  tableSectionId: "tableSectionId",
  user_description: "user_description",
  orderedBy: "orderedBy",
  size: "size",
  fullQuantity: "fullQuantity",
  halfQuantity: "halfQuantity",
  chefAssign: "chefAssign",
  completed: "completed",
  createdAt: "createdAt",
};
