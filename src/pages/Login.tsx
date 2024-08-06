import { Button, Form, Input } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../redux/auth.slice";

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
  const dispatch: any = useDispatch();
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
        </Form.Item>
        <Form.Item className="relative">
          <Input.Password
            size="large"
            placeholder="Password"
            {...(register("password"), { required: true, minLength: 6 })}
            onChange={(e) => setValue("password", e.target.value.trim())}
          />
        </Form.Item>
        <Form.Item>
          <p className="mb-4 text-right">Quên mật khẩu</p>
          <Button
            size="large"
            className="bg-gradient-to-r from-green-300 to-blue-300 hover:from-pink-300 hover:to-yellow-300 text-2xl font-semibold w-1/2"
            style={{ color: "black", height: "auto" }}
            onClick={handleSubmit(() => {
              dispatch(
                login({
                  mail: watch("email"),
                  password: watch("password"),
                })
              );
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
