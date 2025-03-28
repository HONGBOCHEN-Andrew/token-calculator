import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { Github, Twitter } from "lucide-react";

import { ChatGPTEditor } from "../sections/ChatGPTEditor";
import { EncoderSelect } from "~/sections/EncoderSelect";
import { TokenViewer } from "~/sections/TokenViewer";
import { TextArea } from "~/components/Input";
import { type AllOptions, isChatModel, isValidOption } from "~/models";
import { createTokenizer } from "~/models/tokenizer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

function useQueryParamsState() {
  const router = useRouter();

  const params = useMemo((): AllOptions => {
    return isValidOption(router.query?.model)
      ? router.query.model
      : "gpt-4o";
  }, [router.query]);

  const setParams = (model: AllOptions) => {
    router.push({
      pathname: router.pathname,
      query: { model },
    });
  };

  return [params, setParams] as const;
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [inputText, setInputText] = useState<string>("");
  const [model, setModel] = useQueryParamsState();
  const tokenizer = useQuery({
    queryKey: [model],
    queryFn: ({ queryKey: [model] }) => createTokenizer(model!),
  });

  const tokens = tokenizer.data?.tokenize(inputText);

  return (
    <>
      <Head>
        <title>Token Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col gap-8 p-8 bg-slate-900 text-slate-100">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-6 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-4xl font-bold text-white">Token Calculator</h1>
                <p className="mt-2 text-slate-400">Calculate and analyze tokens for various AI models</p>
              </div>
              <div className="w-full sm:w-auto">
                <EncoderSelect
                  value={model}
                  isLoading={tokenizer.isFetching}
                  onChange={(update) => {
                    setModel(update);
                    if (isChatModel(update) !== isChatModel(model)) {
                      setInputText("");
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <section className="flex flex-col gap-4">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">Input Text</h2>
                  <p className="mt-1 text-sm text-slate-400">Enter or paste your text to analyze</p>
                </div>
                {isChatModel(model) && (
                  <div className="mb-6">
                    <ChatGPTEditor model={model} onChange={setInputText} />
                  </div>
                )}
                <TextArea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] w-full rounded-lg border border-slate-700 bg-slate-800 p-4 font-mono text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter your text here..."
                />
              </div>
            </section>

            {/* Analysis Section */}
            <section className="flex flex-col gap-4">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">Token Analysis</h2>
                  <p className="mt-1 text-sm text-slate-400">View detailed token breakdown and statistics</p>
                </div>
                <TokenViewer model={model} data={tokens} isFetching={false} />
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between text-center">
          <p className="text-sm text-slate-400">
            Built by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
              href="https://github.com/boxiatiandefeng"
            >
              Andren chen
            </a>
          </p>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { query: context.query } };
};

export default Home;
