import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useSetRecoilState } from "recoil";
import { walletBalanceAtom } from "../atoms";
import { useToast } from "../hooks/use-toast";

export const useFetchAccountBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const setBalance = useSetRecoilState(walletBalanceAtom);
  const { toast } = useToast();

  const fetchBalance = async () => {
    if (!publicKey) {
      setBalance(0);
      return;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching balance",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      setBalance(0);
    }
  };

  return { fetchBalance };
};
