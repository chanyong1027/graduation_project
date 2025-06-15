import { useState } from "react";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    gender: "",
    age: "",
  });

  const [errors, setErrors] = useState({});

  const isNicknameValid =
    form.nickname.length >= 2 && form.nickname.length <= 10;
  const isEmailValid = form.email.includes("@");

  const validate = () => {
    const newErrors = {};

    if (!isNicknameValid) {
      newErrors.nickname = "닉네임은 2자 이상 10자 이하로 입력해주세요.";
    }

    if (!isEmailValid) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
    }

    const password = form.password;
    const patterns = [
      /[a-zA-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ];
    const passed = patterns.filter(Boolean).length;

    if (password.length < 8 || password.length > 15 || passed < 2) {
      newErrors.password =
        "비밀번호는 8~15자이며, 영문/숫자/특수기호 중 2가지 이상 조합이어야 합니다.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const checkNickname = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.some((user) => user.nickname === form.nickname);
    if (exists) {
      alert("이미 사용 중인 닉네임입니다.");
    } else {
      alert("사용 가능한 닉네임입니다.");
    }
  };

  const checkEmail = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.some((user) => user.email === form.email);
    if (exists) {
      alert("이미 사용 중인 이메일입니다.");
    } else {
      alert("사용 가능한 이메일입니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("users", JSON.stringify(users));
      alert("회원가입 완료!");
      navigate("/login");
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4 fw-bold">회원가입</h3>
      <Form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>닉네임 *</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              isInvalid={!!errors.nickname}
              placeholder="닉네임을 입력하세요 (2~10자)"
            />
            <Button
              variant="outline-secondary"
              onClick={checkNickname}
              style={{ marginLeft: "10px" }}
              disabled={!isNicknameValid}
            >
              중복확인
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            {errors.nickname}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>이메일 *</Form.Label>
          <InputGroup>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="example@email.com"
            />
            <Button
              variant="outline-secondary"
              onClick={checkEmail}
              style={{ marginLeft: "10px" }}
              disabled={!isEmailValid}
            >
              중복확인
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 *</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            placeholder="비밀번호를 입력하세요"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>성별</Form.Label>
          <div>
            <Form.Check
              inline
              label="남성"
              name="gender"
              type="radio"
              value="남성"
              onChange={handleChange}
              checked={form.gender === "남성"}
            />
            <Form.Check
              inline
              label="여성"
              name="gender"
              type="radio"
              value="여성"
              onChange={handleChange}
              checked={form.gender === "여성"}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>연령대</Form.Label>
          <Form.Select name="age" value={form.age} onChange={handleChange}>
            <option value="">선택 안 함</option>
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대 이상">60대 이상</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="dark" className="w-100">
          가입하기
        </Button>
      </Form>
    </Container>
  );
};

export default SignUpPage;
