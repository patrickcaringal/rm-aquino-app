import { useLayoutEffect } from "react";

import { useRouter } from "next/router";

import { PATHS } from "../components/common/Routes";

export default function Home() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push(PATHS.PUBLIC.PATIENT_SIGN_IN);
  }, [router]);

  return null;
}
