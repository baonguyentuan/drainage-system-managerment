import { Button, Form, Input } from "antd";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {};
type InputsLogin = {
  email: string;
  password: string;
};
const Login = (props: Props) => {
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<InputsLogin>();
  console.log(watch("email"));

  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-300">
      <Form
        className="w-full max-w-xl border-2 border-black rounded-2xl p-4 bg-slate-100"
        onSubmitCapture={() => {
          console.log("err", errors);
        }}
      >
        <h1 className="text-4xl font-semibold mb-4">Đăng nhập</h1>
        <Form.Item className="relative">
          <Input
            size="large"
            placeholder="Email"
            {...(register("email"), { required: true })}
            onChange={(e) => setValue("email", e.target.value.trim())}
          />
          <p className="mb-4 text-left absolute left-0 -bottom-10 text-red-500">
            {errors.email ? "Không được bỏ trống" : ""}
          </p>
        </Form.Item>
        <Form.Item className="relative">
          <Input.Password
            size="large"
            placeholder="Password"
            {...(register("password"), { required: true, minLength: 6 })}
            onChange={(e) => setValue("password", e.target.value.trim())}
          />
          <p className="mb-4 text-left  absolute left-0 -bottom-10 text-red-500">
            {errors.password ? "Không được bỏ trống" : ""}
          </p>
        </Form.Item>
        <Form.Item>
          <p className="mb-4 text-right">Quên mật khẩu</p>
          <Button
            size="large"
            className="bg-gradient-to-r from-green-300 to-blue-300 hover:from-pink-300 hover:to-yellow-300 text-2xl font-semibold w-1/2"
            style={{ color: "black", height: "auto" }}
            onClick={handleSubmit(() => {
              console.log(watch("email"));

              // console.log("err", errors.email);
            })}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
