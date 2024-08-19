export default {
  public: {
    defaultRouter: "/book",
    home: "/home",
    login: "/login",
    register: "/register",
  },
  private: {
    map_manager: "/map_manager",
    // book_manager: "/book_manager",
    altitude: "/altitude",
    altitude_book_detail: "/altitude/:id",
    book_placemark: "book_placemark/",
    text_tool: "/text_tool",
    book_calculate: "/book_calculate",
    cad_ggearth: "/cad_ggearth",
    map_point: "/map_point",
    capture_map: "/capture_map",
    measurement_book_detail: "/measurement/:id",
    measurement: "/measurement",
  },
  admin: {
    base: "/admin",
    user_managerment: "/user_managerment",
    role_managerment: "/role_managerment",
    permission_managerment: "/permission_managerment",
  },
};
