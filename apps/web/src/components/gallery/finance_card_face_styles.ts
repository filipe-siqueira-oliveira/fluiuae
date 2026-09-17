import styled from "styled-components";

export const face_ink = {
  strong: "#F5F6F8",
  soft: "rgba(245, 246, 248, 0.8)",
  muted: "rgba(236, 253, 243, 0.62)",
  track: "rgba(236, 253, 243, 0.18)",
};

export const FaceFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  aspect-ratio: 1.586;
  padding: 22px 24px 20px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 0% 100%, rgba(74, 222, 150, 0.22), transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.08), transparent 42%),
    linear-gradient(112deg, transparent 44%, rgba(255, 255, 255, 0.06) 52%, transparent 60%),
    linear-gradient(135deg, #12704A 0%, #0B4E34 52%, #073523 100%);
  box-shadow: 0 22px 40px -22px rgba(7, 53, 35, 0.6);
  color: ${face_ink.strong};
  font-variant-numeric: tabular-nums;

  @container gallery_tile (max-width: 459px) {
    gap: 12px;
    padding: 18px 20px 16px;
  }

  @media (max-width: 480px) {
    aspect-ratio: auto;
    gap: 28px;
    padding: 20px;
  }
`;

export const FaceTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const FaceActionButton = styled.button`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-self: flex-start;
  margin-bottom: 10px;

  @container gallery_tile (max-width: 459px) {
    height: 28px;
    margin-bottom: 6px;
  }
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(236, 253, 243, 0.28);
  border-radius: 999px;
  background: rgba(236, 253, 243, 0.12);
  color: ${face_ink.strong};
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background-color 150ms ease;

  &:hover {
    background: rgba(236, 253, 243, 0.22);
  }

  &:focus-visible {
    outline: 2px solid ${face_ink.strong};
    outline-offset: 2px;
  }
`;

export const FaceBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
  text-align: right;
`;

export const FaceInstitution = styled.span`
  max-width: 220px;
  overflow: hidden;
  color: ${face_ink.soft};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const FaceTag = styled.span`
  color: ${face_ink.muted};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

export const FaceBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @container gallery_tile (max-width: 459px) {
    gap: 9px;
  }
`;

export const FaceAmountRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px 16px;
`;

export const FaceAmountBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FaceLabel = styled.span`
  color: ${face_ink.muted};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

export const FaceAmount = styled.strong<{ $is_negative?: boolean }>`
  @container gallery_tile (max-width: 459px) {
    font-size: 23px;
  }

  color: ${({ $is_negative }) => ($is_negative ? "#FECDCA" : "inherit")};
  font-size: clamp(22px, 2.4vw, 28px);
  font-weight: 600;
  line-height: 1.1;
`;

export const FaceCycle = styled.span`
  padding-bottom: 4px;
  color: ${face_ink.muted};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  @container gallery_tile (max-width: 459px) {
    letter-spacing: 0.06em;
  }
`;

export const FaceName = styled.span`
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;
